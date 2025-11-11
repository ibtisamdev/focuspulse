'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  plannedBlockSchema,
  updatePlannedBlockSchema,
  type PlannedBlockInput,
  type UpdatePlannedBlockInput,
} from '@/lib/validations/planner'

// Helper to verify user authentication and get database user ID
async function getDbUserId() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    throw new Error('Unauthorized')
  }

  // Get the database user record directly
  const user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    throw new Error('User not found in database. Please refresh the page.')
  }

  return user.id
}

/**
 * Get all active planned blocks for the current user
 */
export async function getPlannedBlocks() {
  const userId = await getDbUserId()

  const blocks = await db.plannedBlock.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: [
      { dayOfWeek: 'asc' },
      { startTime: 'asc' },
    ],
  })

  return blocks
}

/**
 * Get planned blocks for a specific day of week
 */
export async function getPlannedBlocksForDay(dayOfWeek: number) {
  const userId = await getDbUserId()

  const blocks = await db.plannedBlock.findMany({
    where: {
      userId,
      dayOfWeek,
      isActive: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  return blocks
}

/**
 * Get planned blocks for today
 */
export async function getPlannedBlocksForToday() {
  const today = new Date().getDay() // 0 = Sunday, 6 = Saturday
  return getPlannedBlocksForDay(today)
}

/**
 * Create a new planned block
 */
export async function createPlannedBlock(input: PlannedBlockInput) {
  const userId = await getDbUserId()

  // Validate input
  const validated = plannedBlockSchema.parse(input)

  // Check for conflicts (overlapping time blocks on same day)
  const conflicts = await checkTimeConflicts(
    userId,
    validated.dayOfWeek,
    validated.startTime,
    validated.duration
  )

  if (conflicts.length > 0) {
    throw new Error(
      `Time conflict detected with existing block: "${conflicts[0].title}"`
    )
  }

  const block = await db.plannedBlock.create({
    data: {
      userId,
      ...validated,
    },
  })

  revalidatePath('/dashboard/planner')
  return block
}

/**
 * Update an existing planned block
 */
export async function updatePlannedBlock(input: UpdatePlannedBlockInput) {
  const userId = await getDbUserId()

  // Validate input
  const validated = updatePlannedBlockSchema.parse(input)
  const { id, ...updateData } = validated

  // Verify ownership
  const existing = await db.plannedBlock.findUnique({
    where: { id },
  })

  if (!existing) {
    throw new Error('Planned block not found')
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized')
  }

  // Check for conflicts (excluding current block)
  if (updateData.dayOfWeek !== undefined && updateData.startTime && updateData.duration) {
    const conflicts = await checkTimeConflicts(
      userId,
      updateData.dayOfWeek,
      updateData.startTime,
      updateData.duration,
      id
    )

    if (conflicts.length > 0) {
      throw new Error(
        `Time conflict detected with existing block: "${conflicts[0].title}"`
      )
    }
  }

  const block = await db.plannedBlock.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/dashboard/planner')
  return block
}

/**
 * Delete a planned block (soft delete by setting isActive = false)
 */
export async function deletePlannedBlock(id: string) {
  const userId = await getDbUserId()

  // Verify ownership
  const existing = await db.plannedBlock.findUnique({
    where: { id },
  })

  if (!existing) {
    throw new Error('Planned block not found')
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized')
  }

  await db.plannedBlock.update({
    where: { id },
    data: { isActive: false },
  })

  revalidatePath('/dashboard/planner')
  return { success: true }
}

/**
 * Toggle a planned block's active status
 */
export async function togglePlannedBlock(id: string, isActive: boolean) {
  const userId = await getDbUserId()

  // Verify ownership
  const existing = await db.plannedBlock.findUnique({
    where: { id },
  })

  if (!existing) {
    throw new Error('Planned block not found')
  }

  if (existing.userId !== userId) {
    throw new Error('Unauthorized')
  }

  const block = await db.plannedBlock.update({
    where: { id },
    data: { isActive },
  })

  revalidatePath('/dashboard/planner')
  return block
}

/**
 * Check for time conflicts with existing blocks
 */
async function checkTimeConflicts(
  userId: string,
  dayOfWeek: number,
  startTime: string,
  duration: number,
  excludeId?: string
) {
  const existingBlocks = await db.plannedBlock.findMany({
    where: {
      userId,
      dayOfWeek,
      isActive: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  })

  // Convert startTime (HH:MM) to minutes since midnight
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const newStartMinutes = startHour * 60 + startMinute
  const newEndMinutes = newStartMinutes + duration

  // Check for overlaps
  const conflicts = existingBlocks.filter((block) => {
    const [blockHour, blockMinute] = block.startTime.split(':').map(Number)
    const blockStartMinutes = blockHour * 60 + blockMinute
    const blockEndMinutes = blockStartMinutes + block.duration

    // Check if intervals overlap
    return (
      (newStartMinutes >= blockStartMinutes && newStartMinutes < blockEndMinutes) ||
      (newEndMinutes > blockStartMinutes && newEndMinutes <= blockEndMinutes) ||
      (newStartMinutes <= blockStartMinutes && newEndMinutes >= blockEndMinutes)
    )
  })

  return conflicts
}

/**
 * Duplicate a planned block to another day
 */
export async function duplicatePlannedBlock(id: string, targetDayOfWeek: number) {
  const userId = await getDbUserId()

  // Get the source block
  const sourceBlock = await db.plannedBlock.findUnique({
    where: { id },
  })

  if (!sourceBlock) {
    throw new Error('Planned block not found')
  }

  if (sourceBlock.userId !== userId) {
    throw new Error('Unauthorized')
  }

  // Check for conflicts on target day
  const conflicts = await checkTimeConflicts(
    userId,
    targetDayOfWeek,
    sourceBlock.startTime,
    sourceBlock.duration
  )

  if (conflicts.length > 0) {
    throw new Error(
      `Time conflict detected on target day with: "${conflicts[0].title}"`
    )
  }

  // Create duplicate
  const newBlock = await db.plannedBlock.create({
    data: {
      userId,
      title: sourceBlock.title,
      dayOfWeek: targetDayOfWeek,
      startTime: sourceBlock.startTime,
      duration: sourceBlock.duration,
      isRecurring: sourceBlock.isRecurring,
      isActive: true,
    },
  })

  revalidatePath('/dashboard/planner')
  return newBlock
}
