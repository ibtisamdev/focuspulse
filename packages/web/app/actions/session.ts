'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Server Actions for Session Management
 *
 * These actions handle all database operations for sessions
 * using Next.js Server Actions pattern (no API routes needed)
 */

/**
 * Create a new session
 * @param title - What the user is working on
 * @param isPlanned - Whether this was a planned session
 * @returns Session ID and start time
 */
export async function createSession(title: string, isPlanned: boolean = false) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Create new session
  const session = await db.session.create({
    data: {
      userId: user.id,
      title,
      isPlanned,
      startTime: new Date(),
      completed: false,
      isPaused: false,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/session')

  return {
    id: session.id,
    startTime: session.startTime,
  }
}

/**
 * Update an existing session
 * @param sessionId - Session ID to update
 * @param data - Data to update
 */
export async function updateSession(
  sessionId: string,
  data: {
    isPaused?: boolean
    pausedAt?: Date
    notes?: string
  }
) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  // Verify session belongs to user
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.user.clerkId !== clerkId) {
    throw new Error('Session not found or unauthorized')
  }

  // Update session
  await db.session.update({
    where: { id: sessionId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/session/${sessionId}`)
}

/**
 * End a session
 * @param sessionId - Session ID to end
 * @param notes - Optional notes about the session
 * @returns Completed session data
 */
export async function endSession(sessionId: string, notes?: string) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  // Verify session belongs to user
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.user.clerkId !== clerkId) {
    throw new Error('Session not found or unauthorized')
  }

  const endTime = new Date()
  const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000)

  // Update session as completed
  const completedSession = await db.session.update({
    where: { id: sessionId },
    data: {
      endTime,
      duration,
      completed: true,
      isPaused: false,
      notes: notes || null,
      updatedAt: new Date(),
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/session')

  return {
    id: completedSession.id,
    duration: completedSession.duration,
    title: completedSession.title,
  }
}

/**
 * Get session by ID
 * @param sessionId - Session ID
 * @returns Session data
 */
export async function getSession(sessionId: string) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.user.clerkId !== clerkId) {
    throw new Error('Session not found or unauthorized')
  }

  return session
}

/**
 * Get user's session statistics for today
 * @returns Today's stats
 */
export async function getUserStats() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Count sessions today
  const sessionsToday = await db.session.count({
    where: {
      userId: user.id,
      completed: true,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
    },
  })

  // Calculate total focus time today (in seconds)
  const todaySessions = await db.session.findMany({
    where: {
      userId: user.id,
      completed: true,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: {
      duration: true,
    },
  })

  const totalSecondsToday = todaySessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  )

  // Format focus time
  const hours = Math.floor(totalSecondsToday / 3600)
  const minutes = Math.floor((totalSecondsToday % 3600) / 60)
  const focusTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  // Get user's weekly goal
  const targetHours = user.weeklyGoalHours || 12
  const target = `${targetHours}h`

  return {
    sessionsToday,
    focusTime,
    target,
    totalSecondsToday,
  }
}

/**
 * Get user's active session (if any)
 * @returns Active session or null
 */
export async function getActiveSession() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Find any incomplete session
  const activeSession = await db.session.findFirst({
    where: {
      userId: user.id,
      completed: false,
    },
    orderBy: {
      startTime: 'desc',
    },
  })

  return activeSession
}
