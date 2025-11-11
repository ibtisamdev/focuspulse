import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { ActiveSessionView } from '../components/ActiveSessionView'
import { getSession, updateSession, endSession, getUserStats } from '@/app/actions/session'

/**
 * Dynamic Session Page
 *
 * Resume an existing session by ID
 * Fetches real session data from database
 */

export default async function SessionByIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Ensure user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Await params (Next.js 15+ requirement)
  const { id } = await params

  // Fetch session from database
  let session
  try {
    session = await getSession(id)
  } catch (error) {
    // Session not found or unauthorized
    notFound()
  }

  // If session is already completed, redirect to dashboard
  if (session.completed) {
    redirect('/dashboard')
  }

  // Calculate elapsed seconds from start time
  const now = new Date()
  const totalElapsedSeconds = Math.floor((now.getTime() - session.startTime.getTime()) / 1000)

  // Subtract break time to get net elapsed time
  let elapsedSeconds = totalElapsedSeconds - session.totalBreakTime

  // If currently paused, also subtract the current pause duration
  if (session.isPaused && session.pausedAt) {
    const currentPauseDuration = Math.floor((now.getTime() - session.pausedAt.getTime()) / 1000)
    elapsedSeconds -= currentPauseDuration
  }

  // Get user stats
  const stats = await getUserStats()

  // Server action wrappers for client component
  async function handleUpdateSession(sessionId: string, data: { isPaused: boolean; pausedAt?: Date }) {
    'use server'
    await updateSession(sessionId, data)
  }

  async function handleEndSession(sessionId: string, notes?: string) {
    'use server'
    await endSession(sessionId, notes)
  }

  return (
    <ActiveSessionView
      sessionId={session.id}
      title={session.title}
      startTime={session.startTime}
      initialElapsedSeconds={elapsedSeconds}
      sessionsToday={stats.sessionsToday}
      focusTime={stats.focusTime}
      target={stats.target}
      onUpdateSession={handleUpdateSession}
      onEndSession={handleEndSession}
    />
  )
}
