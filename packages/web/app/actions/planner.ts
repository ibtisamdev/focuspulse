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
import { extractTimeString } from '@/lib/utils/planner-db'

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
      { startTime: 'asc' },
    ],
  })

  return blocks
}

/**
 * Get planned blocks for a specific day of week
 * Includes recurring blocks for that day
 * Note: Day of week is calculated from startTime (Monday=0)
 */
export async function getPlannedBlocksForDay(dayOfWeek: number) {
  const userId = await getDbUserId()

  // Fetch all recurring blocks and filter in memory by day of week
  const allBlocks = await db.plannedBlock.findMany({
    where: {
      userId,
      isRecurring: true,
      isActive: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  // Filter by day of week (calculated from startTime)
  const blocks = allBlocks.filter((block) => {
    const calculatedDay = (block.startTime.getDay() + 6) % 7 // Convert to Monday-based
    return calculatedDay === dayOfWeek
  })

  return blocks
}

/**
 * Get planned blocks for today
 */
export async function getPlannedBlocksForToday() {
  const today = (new Date().getDay() + 6) % 7 // Convert to Monday-based (0 = Monday)
  return getPlannedBlocksForDay(today)
}

/**
 * Get planned blocks for a specific date range
 */
export async function getPlannedBlocksForDateRange(startDate: Date, endDate: Date) {
  const userId = await getDbUserId()

  const blocks = await db.plannedBlock.findMany({
    where: {
      userId,
      isActive: true,
      OR: [
        // Recurring blocks (show in all date ranges unless past recurrenceEndDate)
        {
          isRecurring: true,
          OR: [
            { recurrenceEndDate: null },
            { recurrenceEndDate: { gte: startDate } },
          ],
        },
        // One-time events within the date range
        {
          isRecurring: false,
          specificDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      ],
    },
    orderBy: [
      { startTime: 'asc' },
    ],
  })

  return blocks
}

/**
 * Create a new planned block
 */
export async function createPlannedBlock(input: PlannedBlockInput) {
  const userId = await getDbUserId()

  // Validate input
  const validated = plannedBlockSchema.parse(input)

  // For conflict checking, we need dayOfWeek even for one-time events (Monday-based)
  // If not provided (one-time event), calculate from specificDate
  const dayOfWeekForConflicts = validated.dayOfWeek ??
    (validated.specificDate ? (validated.specificDate.getDay() + 6) % 7 : (new Date().getDay() + 6) % 7)

  // Check for conflicts (overlapping time blocks on same day)
  const conflicts = await checkTimeConflicts(
    userId,
    dayOfWeekForConflicts,
    validated.startTime,
    validated.duration,
    validated.isRecurring,
    validated.specificDate
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
  if (updateData.startTime && updateData.duration) {
    // Calculate dayOfWeek for conflict checking (Monday-based)
    // Use startTime to determine day for recurring events
    const dayOfWeekForConflicts = updateData.dayOfWeek ??
      (updateData.specificDate ? (updateData.specificDate.getDay() + 6) % 7 :
       existing.specificDate ? (existing.specificDate.getDay() + 6) % 7 :
       (existing.startTime.getDay() + 6) % 7)

    const conflicts = await checkTimeConflicts(
      userId,
      dayOfWeekForConflicts,
      updateData.startTime,
      updateData.duration,
      updateData.isRecurring ?? existing.isRecurring,
      updateData.specificDate ?? existing.specificDate,
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
 * Now works with DateTime instead of string times
 */
async function checkTimeConflicts(
  userId: string,
  dayOfWeek: number,
  startTime: Date,
  duration: number,
  isRecurring: boolean,
  specificDate?: Date | null,
  excludeId?: string
) {
  // Get all blocks that could potentially conflict
  // Fetch all recurring and one-time blocks, then filter by day
  const allBlocks = await db.plannedBlock.findMany({
    where: {
      userId,
      isActive: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  })

  // Filter recurring blocks by day of week (calculated from startTime)
  const existingBlocks = allBlocks.filter((block) => {
    if (block.isRecurring) {
      const blockDay = (block.startTime.getDay() + 6) % 7 // Convert to Monday-based
      return blockDay === dayOfWeek
    }
    return true // Include all one-time events for further filtering
  })

  // For one-time events, only check against blocks on the same specific date
  if (!isRecurring && specificDate) {
    // Filter to only include:
    // 1. Recurring blocks (appear on this day every week)
    // 2. One-time events on the same date
    const relevantBlocks = existingBlocks.filter((block) => {
      if (block.isRecurring) return true
      if (!block.specificDate) return false

      // Check if same date (ignoring time)
      const blockDate = new Date(block.specificDate)
      return (
        blockDate.getFullYear() === specificDate.getFullYear() &&
        blockDate.getMonth() === specificDate.getMonth() &&
        blockDate.getDate() === specificDate.getDate()
      )
    })

    return checkBlockOverlaps(relevantBlocks, startTime, duration)
  }

  // For recurring events, check against all blocks on this day
  return checkBlockOverlaps(existingBlocks, startTime, duration)
}

/**
 * Helper to check if a new block overlaps with existing blocks
 */
function checkBlockOverlaps(
  existingBlocks: Array<{ startTime: Date; duration: number; title: string }>,
  newStartTime: Date,
  newDuration: number
) {
  // Extract time as minutes since midnight for easier comparison
  const newStartMinutes = newStartTime.getHours() * 60 + newStartTime.getMinutes()
  const newEndMinutes = newStartMinutes + newDuration

  // Check for overlaps
  const conflicts = existingBlocks.filter((block) => {
    const blockStartMinutes = block.startTime.getHours() * 60 + block.startTime.getMinutes()
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
 * Duplicate a planned block to another day or as a recurring block
 */
export async function duplicatePlannedBlock(
  id: string,
  targetDayOfWeek: number,
  options?: {
    makeRecurring?: boolean
    recurrenceFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  }
) {
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
    sourceBlock.duration,
    options?.makeRecurring ?? sourceBlock.isRecurring,
    sourceBlock.specificDate
  )

  if (conflicts.length > 0) {
    throw new Error(
      `Time conflict detected on target day with: "${conflicts[0].title}"`
    )
  }

  // Calculate new startTime for recurring events (encode day of week)
  const isRecurring = options?.makeRecurring ?? sourceBlock.isRecurring
  let newStartTime = sourceBlock.startTime

  if (isRecurring) {
    // Encode targetDayOfWeek in startTime using reference week (2024-01-01 = Monday)
    const referenceWeekStart = new Date('2024-01-01') // Monday
    const targetDate = new Date(referenceWeekStart)
    targetDate.setDate(referenceWeekStart.getDate() + targetDayOfWeek)
    // Preserve time component from source
    targetDate.setHours(sourceBlock.startTime.getHours())
    targetDate.setMinutes(sourceBlock.startTime.getMinutes())
    targetDate.setSeconds(0)
    targetDate.setMilliseconds(0)
    newStartTime = targetDate
  }

  // Create duplicate with all fields
  const newBlock = await db.plannedBlock.create({
    data: {
      userId,
      title: sourceBlock.title,
      description: sourceBlock.description,
      startTime: newStartTime,
      duration: sourceBlock.duration,
      category: sourceBlock.category,
      color: sourceBlock.color,
      priority: sourceBlock.priority,
      tags: sourceBlock.tags,
      isRecurring,
      recurrenceFrequency: options?.recurrenceFrequency ?? sourceBlock.recurrenceFrequency,
      recurrenceDays: sourceBlock.recurrenceDays,
      recurrenceEndDate: sourceBlock.recurrenceEndDate,
      specificDate: sourceBlock.specificDate,
      reminderMinutes: sourceBlock.reminderMinutes,
      isActive: true,
    },
  })

  revalidatePath('/dashboard/planner')
  return newBlock
}

/**
 * Create a session from a planned block
 */
export async function createSessionFromPlannedBlock(plannedBlockId: string) {
  const userId = await getDbUserId()

  const plannedBlock = await db.plannedBlock.findUnique({
    where: { id: plannedBlockId },
  })

  if (!plannedBlock) {
    throw new Error('Planned block not found')
  }

  if (plannedBlock.userId !== userId) {
    throw new Error('Unauthorized')
  }

  const session = await db.session.create({
    data: {
      userId,
      title: plannedBlock.title,
      plannedBlockId: plannedBlock.id,
      category: plannedBlock.category,
      tags: plannedBlock.tags,
      startTime: new Date(), // Start now
    },
  })

  revalidatePath('/dashboard')
  return session
}
