import type { PlannedBlock } from '@prisma/client'
import type { PlannerEvent, EventCategory, EventColor, DayOfWeek } from '@/lib/types/planner'

/**
 * Calculate end time from start time and duration
 * @param startTime - Time in HH:MM format
 * @param durationMinutes - Duration in minutes
 * @returns End time in HH:MM format
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startMinutes = hours * 60 + minutes
  const endMinutes = startMinutes + durationMinutes

  const endHours = Math.floor(endMinutes / 60) % 24
  const endMins = endMinutes % 60

  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
}

/**
 * Get the date for a specific day of week in a given week
 * @param weekStartDate - Start date of the week (Sunday)
 * @param dayOfWeek - Day of week (0 = Sunday, 6 = Saturday)
 * @returns Date object for that day
 */
export function getDateForDayOfWeek(weekStartDate: Date, dayOfWeek: number): Date {
  const date = new Date(weekStartDate)
  date.setDate(date.getDate() + dayOfWeek)
  return date
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Convert PlannedBlock to PlannerEvent for a specific date
 * @param block - PlannedBlock from database
 * @param date - The specific date for this event
 * @returns PlannerEvent for the UI
 */
export function plannedBlockToEvent(
  block: PlannedBlock,
  date: Date
): PlannerEvent {
  const endTime = calculateEndTime(block.startTime, block.duration)

  return {
    id: block.id,
    title: block.title,
    startTime: block.startTime,
    endTime: endTime,
    date: formatDateISO(date),
    // Default to 'work' category and 'blue' color
    // These could be extended in the PlannedBlock model later
    category: 'work' as EventCategory,
    color: 'blue' as EventColor,
  }
}

/**
 * Convert PlannedBlock to multiple PlannerEvents for a week
 * Handles recurring blocks by creating an event for the specific day of week
 * @param block - PlannedBlock from database
 * @param weekStartDate - Start date of the week (Sunday)
 * @returns PlannerEvent for the matching day in the week
 */
export function plannedBlockToWeekEvent(
  block: PlannedBlock,
  weekStartDate: Date
): PlannerEvent {
  const eventDate = getDateForDayOfWeek(weekStartDate, block.dayOfWeek)
  return plannedBlockToEvent(block, eventDate)
}

/**
 * Convert array of PlannedBlocks to array of PlannerEvents for a week
 * @param blocks - Array of PlannedBlocks
 * @param weekStartDate - Start date of the week (Sunday)
 * @returns Array of PlannerEvents
 */
export function plannedBlocksToWeekEvents(
  blocks: PlannedBlock[],
  weekStartDate: Date
): PlannerEvent[] {
  return blocks.map((block) => plannedBlockToWeekEvent(block, weekStartDate))
}

/**
 * Convert array of PlannedBlocks to events grouped by day
 * @param blocks - Array of PlannedBlocks
 * @param days - Array of DayOfWeek objects from week data
 * @returns Map of date (YYYY-MM-DD) to PlannerEvents
 */
export function groupEventsByDay(
  blocks: PlannedBlock[],
  days: DayOfWeek[]
): Map<string, PlannerEvent[]> {
  const eventsByDay = new Map<string, PlannerEvent[]>()

  // Initialize map with all days
  days.forEach((day) => {
    eventsByDay.set(day.isoDate, [])
  })

  // Convert blocks to events and group by day
  blocks.forEach((block) => {
    // Find the matching day in the week
    const matchingDay = days.find((day) => day.date.getDay() === block.dayOfWeek)
    if (matchingDay) {
      const event = plannedBlockToEvent(block, matchingDay.date)
      const dayEvents = eventsByDay.get(matchingDay.isoDate) || []
      dayEvents.push(event)
      eventsByDay.set(matchingDay.isoDate, dayEvents)
    }
  })

  return eventsByDay
}

/**
 * Extract PlannedBlock creation data from PlannerEvent
 * Used when creating a new block from the UI
 * @param event - Partial PlannerEvent from the UI
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Data for creating PlannedBlock
 */
export function eventToPlannedBlockData(
  event: Partial<PlannerEvent> & { title: string; startTime: string; duration: number },
  dateString: string
) {
  // Parse the date to get day of week
  const date = new Date(dateString + 'T00:00:00')
  const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday

  return {
    title: event.title,
    dayOfWeek,
    startTime: event.startTime,
    duration: event.duration,
    isRecurring: false, // Default to non-recurring
  }
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Calculate duration in minutes between two times
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)

  // Handle overnight events (endTime < startTime)
  if (endMinutes < startMinutes) {
    return (24 * 60) - startMinutes + endMinutes
  }

  return endMinutes - startMinutes
}
