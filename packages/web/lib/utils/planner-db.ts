import type { PlannedBlock, Session } from '@prisma/client'
import type { PlannerEvent, EventCategory, EventColor, DayOfWeek } from '@/lib/types/planner'
import { BlockCategory } from '@prisma/client'

// ============================================================================
// DateTime Utility Functions
// ============================================================================

/**
 * Extract time as HH:MM string from Date object
 * @param date - Date object
 * @returns Time in HH:MM format
 */
export function extractTimeString(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Combine a date with a time to create a new DateTime
 * @param date - Date for the event
 * @param time - Time string in HH:MM format
 * @returns Combined DateTime
 */
export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)
  return combined
}

/**
 * Combine date with DateTime's time component
 * @param date - Date to use
 * @param dateTime - DateTime to extract time from
 * @returns New DateTime with date from first param and time from second
 */
export function combineDateWithDateTime(date: Date, dateTime: Date): Date {
  const result = new Date(date)
  result.setHours(dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds(), 0)
  return result
}

/**
 * Calculate end DateTime from start DateTime and duration
 * @param startTime - Start DateTime
 * @param durationMinutes - Duration in minutes
 * @returns End DateTime
 */
export function calculateEndDateTime(startTime: Date, durationMinutes: number): Date {
  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + durationMinutes)
  return endTime
}

/**
 * Calculate end time string from start time string and duration
 * (Legacy function for UI compatibility)
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

// ============================================================================
// Session Duration Calculations (removed Session.duration field)
// ============================================================================

/**
 * Calculate session duration in seconds (excluding breaks)
 * Returns net focus time
 * @param session - Session object with startTime, endTime, totalBreakTime
 * @returns Duration in seconds, or null if session not ended
 */
export function calculateSessionDuration(session: Pick<Session, 'startTime' | 'endTime' | 'totalBreakTime'>): number | null {
  if (!session.endTime) {
    return null // Session not completed
  }

  const totalTime = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)
  const focusTime = totalTime - session.totalBreakTime

  return Math.max(0, focusTime) // Ensure non-negative
}

/**
 * Calculate session duration in minutes
 * @param session - Session object
 * @returns Duration in minutes, or null if session not ended
 */
export function calculateSessionDurationMinutes(session: Pick<Session, 'startTime' | 'endTime' | 'totalBreakTime'>): number | null {
  const seconds = calculateSessionDuration(session)
  return seconds !== null ? Math.floor(seconds / 60) : null
}

/**
 * Calculate session elapsed time (for active sessions)
 * @param session - Session object
 * @returns Elapsed time in seconds
 */
export function calculateSessionElapsedTime(session: Pick<Session, 'startTime' | 'endTime' | 'totalBreakTime' | 'isPaused' | 'pausedAt'>): number {
  const endTime = session.endTime || (session.isPaused && session.pausedAt) || new Date()
  const totalTime = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000)
  const focusTime = totalTime - session.totalBreakTime

  return Math.max(0, focusTime)
}

// ============================================================================
// Date/Week Utility Functions
// ============================================================================

/**
 * Get the day of week for a PlannedBlock
 * For recurring events: use stored dayOfWeek
 * For one-time events: calculate from specificDate
 * @param block - PlannedBlock from database
 * @returns Day of week (0-6, Sunday=0)
 */
export function getBlockDayOfWeek(block: Pick<PlannedBlock, 'dayOfWeek' | 'specificDate' | 'isRecurring'>): number {
  if (block.dayOfWeek !== null && block.dayOfWeek !== undefined) {
    return block.dayOfWeek
  }
  // For one-time events without dayOfWeek, derive from specificDate
  if (block.specificDate) {
    return block.specificDate.getDay()
  }
  // Fallback (shouldn't happen with valid data)
  return new Date().getDay()
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
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateISO(date1) === formatDateISO(date2)
}

// ============================================================================
// PlannedBlock to Event Conversion
// ============================================================================

/**
 * Map BlockCategory enum to UI EventCategory
 */
function mapBlockCategoryToEventCategory(category: BlockCategory): EventCategory {
  const mapping: Record<BlockCategory, EventCategory> = {
    [BlockCategory.WORK]: 'work',
    [BlockCategory.STUDY]: 'work', // Map to work for now
    [BlockCategory.PERSONAL]: 'personal',
    [BlockCategory.EXERCISE]: 'personal',
    [BlockCategory.BREAK]: 'personal',
    [BlockCategory.OTHER]: 'work',
  }
  return mapping[category]
}

/**
 * Map BlockCategory enum to UI EventColor
 */
function mapBlockCategoryToEventColor(category: BlockCategory, customColor?: string | null): EventColor {
  // If custom color is provided, try to map it
  if (customColor) {
    const colorMap: Record<string, EventColor> = {
      '#3b82f6': 'blue',
      '#ef4444': 'orange',    // red → orange (closest match)
      '#10b981': 'green',
      '#f59e0b': 'orange',
      '#8b5cf6': 'purple',
    }
    const mapped = colorMap[customColor.toLowerCase()]
    if (mapped) return mapped
  }

  // Default colors by category
  const mapping: Record<BlockCategory, EventColor> = {
    [BlockCategory.WORK]: 'blue',
    [BlockCategory.STUDY]: 'purple',
    [BlockCategory.PERSONAL]: 'green',
    [BlockCategory.EXERCISE]: 'orange',
    [BlockCategory.BREAK]: 'zinc',
    [BlockCategory.OTHER]: 'blue',
  }
  return mapping[category]
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
  // For recurring events, use the provided date with the time from startTime
  // For one-time events, use the actual startTime (which includes both date and time)
  const eventDateTime = block.isRecurring
    ? combineDateWithDateTime(date, block.startTime)
    : block.startTime

  const startTimeStr = extractTimeString(eventDateTime)
  const endTimeStr = calculateEndTime(startTimeStr, block.duration)

  return {
    id: block.id,
    title: block.title,
    startTime: startTimeStr,
    endTime: endTimeStr,
    date: formatDateISO(date),
    category: mapBlockCategoryToEventCategory(block.category),
    color: mapBlockCategoryToEventColor(block.category, block.color),
  }
}

/**
 * Convert PlannedBlock to PlannerEvent for a week
 * Handles recurring blocks by creating an event for the specific day of week
 * @param block - PlannedBlock from database
 * @param weekStartDate - Start date of the week (Sunday)
 * @returns PlannerEvent for the matching day in the week
 */
export function plannedBlockToWeekEvent(
  block: PlannedBlock,
  weekStartDate: Date
): PlannerEvent {
  // For one-time events, use the specificDate
  // For recurring events, calculate date based on dayOfWeek
  const eventDate = !block.isRecurring && block.specificDate
    ? block.specificDate
    : getDateForDayOfWeek(weekStartDate, getBlockDayOfWeek(block))

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
  // Calculate week end date (Saturday at 23:59:59)
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)
  weekEndDate.setHours(23, 59, 59, 999)

  // Filter blocks based on recurring status and date
  const filteredBlocks = blocks.filter((block) => {
    // Skip inactive blocks
    if (!block.isActive) {
      return false
    }

    // Recurring events: show in all weeks (unless past recurrenceEndDate)
    if (block.isRecurring) {
      if (block.recurrenceEndDate) {
        return weekStartDate <= block.recurrenceEndDate
      }
      return true
    }

    // Non-recurring events: only show if specificDate falls within this week
    if (block.specificDate) {
      const specificDate = new Date(block.specificDate)
      return specificDate >= weekStartDate && specificDate <= weekEndDate
    }

    // If not recurring and no specific date, don't show it
    return false
  })

  return filteredBlocks.map((block) => plannedBlockToWeekEvent(block, weekStartDate))
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
    const blockDayOfWeek = getBlockDayOfWeek(block)
    const matchingDay = days.find((day) => day.date.getDay() === blockDayOfWeek)
    if (matchingDay) {
      const event = plannedBlockToEvent(block, matchingDay.date)
      const dayEvents = eventsByDay.get(matchingDay.isoDate) || []
      dayEvents.push(event)
      eventsByDay.set(matchingDay.isoDate, dayEvents)
    }
  })

  return eventsByDay
}

// ============================================================================
// Time Parsing & Formatting (for UI compatibility)
// ============================================================================

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
 * Calculate duration in minutes between two time strings
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

/**
 * Extract PlannedBlock creation data from UI event
 * Used when creating a new block from the UI
 * @param event - Partial PlannerEvent from the UI
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Data for creating PlannedBlock
 */
export function eventToPlannedBlockData(
  event: Partial<PlannerEvent> & { title: string; startTime: string; duration: number },
  dateString: string
) {
  // Parse the date
  const date = new Date(dateString + 'T00:00:00')

  // Combine date and time to create DateTime
  const startDateTime = combineDateAndTime(date, event.startTime)

  return {
    title: event.title,
    // dayOfWeek is not needed for non-recurring events (derived from specificDate)
    startTime: startDateTime,
    duration: event.duration,
    isRecurring: false, // Default to non-recurring
    specificDate: date, // For non-recurring events
  }
}
