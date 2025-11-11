import { DayOfWeek, DaySummary, PlannerEvent, TimeSlot, WeekData } from '../types/planner';

/**
 * Gets the week number for a given date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Gets the start of the week (Sunday) for a given date
 * Note: Returns Sunday as start to match dayOfWeek in PlannedBlock (0 = Sunday)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday is day 0
  return new Date(d.setDate(diff));
}

/**
 * Generates a WeekData object for a given date
 */
export function getWeekData(date: Date): WeekData {
  const startDate = getStartOfWeek(date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const days: DayOfWeek[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() + i);

    const dayDate = new Date(currentDay);
    dayDate.setHours(0, 0, 0, 0);

    days.push({
      date: currentDay,
      dayName: currentDay.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: currentDay.getDate(),
      monthName: currentDay.toLocaleDateString('en-US', { month: 'short' }),
      isToday: dayDate.getTime() === today.getTime(),
      isoDate: currentDay.toISOString().split('T')[0],
    });
  }

  const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

  return {
    weekNumber: getWeekNumber(startDate),
    year: startDate.getFullYear(),
    startDate,
    endDate,
    days,
    dateRange,
  };
}

/**
 * Navigates to the previous week
 */
export function getPreviousWeek(currentWeek: WeekData): WeekData {
  const prevWeekDate = new Date(currentWeek.startDate);
  prevWeekDate.setDate(prevWeekDate.getDate() - 7);
  return getWeekData(prevWeekDate);
}

/**
 * Navigates to the next week
 */
export function getNextWeek(currentWeek: WeekData): WeekData {
  const nextWeekDate = new Date(currentWeek.startDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  return getWeekData(nextWeekDate);
}

/**
 * Generates time slots for the timeline (24 hours: 12 AM to 11 PM)
 */
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 0; hour <= 23; hour++) {
    const isPM = hour >= 12;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = isPM ? 'PM' : 'AM';
    slots.push({
      hour,
      label: `${displayHour}:00 ${period}`,
    });
  }
  return slots;
}

/**
 * Converts time string (HH:mm) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculates the position and height for an event block in the timeline
 * Returns top position and height in pixels
 */
export function calculateEventPosition(
  startTime: string,
  endTime: string,
  timelineStartHour: number = 0
): { top: number; height: number } {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const timelineStartMinutes = timelineStartHour * 60;

  const minutesPerPixel = 1; // 1 pixel per minute (60px per hour)
  const top = (startMinutes - timelineStartMinutes) * minutesPerPixel;
  const height = (endMinutes - startMinutes) * minutesPerPixel;

  return { top, height };
}

/**
 * Formats time string to 12-hour format
 */
export function formatTime12Hour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const isPM = hours >= 12;
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const period = isPM ? 'PM' : 'AM';
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Formats a time range
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}`;
}

/**
 * Calculates summary statistics for a day's events
 */
export function calculateDaySummary(events: PlannerEvent[], date: string): DaySummary {
  const dayEvents = events.filter(event => event.date === date);
  const totalEvents = dayEvents.length;

  let scheduledMinutes = 0;
  dayEvents.forEach(event => {
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime);
    scheduledMinutes += (end - start);
  });

  // Full 24-hour day (24 hours = 1440 minutes)
  const totalDayMinutes = 24 * 60;
  const freeMinutes = totalDayMinutes - scheduledMinutes;

  return {
    totalEvents,
    scheduledMinutes,
    freeMinutes,
    scheduledTime: formatMinutesToTime(scheduledMinutes),
    freeTime: formatMinutesToTime(freeMinutes),
  };
}

/**
 * Formats minutes to "Xh Ym" format
 */
export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

/**
 * Filters events for a specific date
 */
export function getEventsForDate(events: PlannerEvent[], date: string): PlannerEvent[] {
  return events.filter(event => event.date === date).sort((a, b) => {
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });
}

/**
 * Gets upcoming events (sorted by date and time)
 * Filters out events that have already ended
 */
export function getUpcomingEvents(events: PlannerEvent[], fromDate: string, limit: number = 10): PlannerEvent[] {
  const now = new Date();
  const todayDate = now.toISOString().split('T')[0];
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  return events
    .filter(event => {
      const eventDate = new Date(event.date);
      const fromDateObj = new Date(fromDate);

      // Event must be on or after fromDate
      if (eventDate < fromDateObj) {
        return false;
      }

      // For events today, check if they've already ended
      if (event.date === todayDate) {
        const eventEndMinutes = timeToMinutes(event.endTime);
        return eventEndMinutes > currentTimeMinutes;
      }

      // Future events are always included
      return true;
    })
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    })
    .slice(0, limit);
}

/**
 * Groups events by date
 */
export function groupEventsByDate(events: PlannerEvent[]): Record<string, PlannerEvent[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, PlannerEvent[]>);
}

/**
 * Checks if two date strings are the same day
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Gets today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISODate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Calculates the current time position in pixels for the timeline
 * Returns null if not today, otherwise returns pixel position from top
 */
export function getCurrentTimePosition(): number | null {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Convert current time to minutes since midnight
  const currentMinutes = hours * 60 + minutes;

  // 1 pixel per minute (60px per hour, matching timeline scale)
  return currentMinutes;
}

/**
 * Gets current time formatted as "h:mm AM/PM"
 */
export function getCurrentTimeFormatted(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const isPM = hours >= 12;
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const period = isPM ? 'PM' : 'AM';
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Formats date to readable string
 */
export function formatDate(date: Date | string, format: 'long' | 'short' = 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } else {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
