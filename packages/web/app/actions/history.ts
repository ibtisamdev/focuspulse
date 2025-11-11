'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

/**
 * Get all-time history statistics for the current user
 */
export async function getHistoryStats() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (!user) throw new Error('User not found')

  // Get all completed sessions
  const sessions = await db.session.findMany({
    where: {
      userId: user.id,
      completed: true,
    },
    select: {
      duration: true,
      startTime: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  // Calculate total hours
  const totalSeconds = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)
  const totalHours = totalSeconds / 3600

  // Calculate current streak
  const { currentStreak, longestStreak } = calculateStreaks(sessions)

  // Calculate average session length
  const avgLength = sessions.length > 0 ? totalSeconds / sessions.length / 60 : 0 // in minutes

  return {
    totalHours: Number(totalHours.toFixed(1)),
    streak: currentStreak,
    longestStreak,
    sessionCount: sessions.length,
    avgLength: Math.round(avgLength),
  }
}

/**
 * Calculate current and longest streaks from sessions
 */
function calculateStreaks(sessions: { startTime: Date }[]): { currentStreak: number; longestStreak: number } {
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Get unique days with sessions (in local timezone)
  const daysWithSessions = new Set<string>()
  sessions.forEach(session => {
    const dateStr = session.startTime.toISOString().split('T')[0]
    daysWithSessions.add(dateStr)
  })

  const sortedDays = Array.from(daysWithSessions).sort()

  // Calculate current streak (from today backwards)
  const today = new Date().toISOString().split('T')[0]
  let currentStreak = 0
  let checkDate = new Date()

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0]
    if (daysWithSessions.has(dateStr)) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // Allow for today not having a session yet, but if yesterday also missing, streak is broken
      if (dateStr === today) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue
      }
      break
    }
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 1

  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1])
    const currDate = new Date(sortedDays[i])
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  return { currentStreak, longestStreak }
}

/**
 * Get weekly data for a specific week offset
 * @param weekOffset 0 = current week, -1 = last week, etc.
 */
export async function getWeeklyData(weekOffset: number = 0) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (!user) throw new Error('User not found')

  // Calculate week boundaries (Sunday to Saturday)
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 6 = Saturday
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - currentDay + (weekOffset * 7))
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  weekEnd.setHours(0, 0, 0, 0)

  // Get all completed sessions in this week
  const sessions = await db.session.findMany({
    where: {
      userId: user.id,
      completed: true,
      startTime: {
        gte: weekStart,
        lt: weekEnd,
      },
    },
    select: {
      duration: true,
      startTime: true,
    },
  })

  // Initialize array for 7 days (Sunday to Saturday)
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      hours: 0,
      date: date.toISOString().split('T')[0],
    }
  })

  // Aggregate sessions by day
  sessions.forEach(session => {
    const dayIndex = session.startTime.getDay()
    weekData[dayIndex].hours += (session.duration || 0) / 3600
  })

  // Round hours to 1 decimal place
  weekData.forEach(day => {
    day.hours = Number(day.hours.toFixed(1))
  })

  return weekData
}

/**
 * Get paginated sessions history with optional filters
 */
export async function getSessionsHistory(options?: {
  searchQuery?: string
  type?: 'all' | 'planned' | 'adhoc'
  limit?: number
  offset?: number
}) {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (!user) throw new Error('User not found')

  const { searchQuery, type = 'all', limit = 20, offset = 0 } = options || {}

  // Build where clause
  const where: any = {
    userId: user.id,
    completed: true,
  }

  if (type === 'planned') {
    where.isPlanned = true
  } else if (type === 'adhoc') {
    where.isPlanned = false
  }

  if (searchQuery && searchQuery.trim()) {
    where.title = {
      contains: searchQuery.trim(),
      mode: 'insensitive',
    }
  }

  // Get sessions
  const sessions = await db.session.findMany({
    where,
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
      duration: true,
      notes: true,
      isPlanned: true,
    },
    orderBy: {
      startTime: 'desc',
    },
    take: limit,
    skip: offset,
  })

  // Get total count for pagination
  const totalCount = await db.session.count({ where })

  // Group sessions by date
  const groupedSessions: { [key: string]: any[] } = {}
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  sessions.forEach(session => {
    const dateStr = session.startTime.toISOString().split('T')[0]
    let dateLabel = dateStr

    if (dateStr === today) {
      dateLabel = 'Today'
    } else if (dateStr === yesterday) {
      dateLabel = 'Yesterday'
    } else {
      // Format as "Nov 8"
      const date = new Date(session.startTime)
      dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (!groupedSessions[dateLabel]) {
      groupedSessions[dateLabel] = []
    }

    groupedSessions[dateLabel].push({
      id: session.id,
      title: session.title,
      startTime: session.startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      endTime: session.endTime?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      duration: Math.round((session.duration || 0) / 60), // Convert to minutes
      notes: session.notes,
      isPlanned: session.isPlanned,
    })
  })

  return {
    groupedSessions,
    totalCount,
    hasMore: offset + limit < totalCount,
  }
}

/**
 * Get performance insights
 */
export async function getInsights() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (!user) throw new Error('User not found')

  // Get all completed sessions
  const sessions = await db.session.findMany({
    where: {
      userId: user.id,
      completed: true,
    },
    select: {
      duration: true,
      startTime: true,
      isPlanned: true,
    },
  })

  if (sessions.length === 0) {
    return {
      bestDay: { day: 'N/A', avgHours: 0 },
      peakHours: { range: 'N/A', percentage: 0 },
      completionRate: 0,
    }
  }

  // Calculate best day (day of week with highest average hours)
  const dayTotals: { [key: number]: { hours: number; count: number } } = {}
  sessions.forEach(session => {
    const dayOfWeek = session.startTime.getDay()
    if (!dayTotals[dayOfWeek]) {
      dayTotals[dayOfWeek] = { hours: 0, count: 0 }
    }
    dayTotals[dayOfWeek].hours += (session.duration || 0) / 3600
    dayTotals[dayOfWeek].count += 1
  })

  let bestDayIndex = 0
  let bestDayAvg = 0
  Object.entries(dayTotals).forEach(([day, data]) => {
    const avg = data.hours / data.count
    if (avg > bestDayAvg) {
      bestDayAvg = avg
      bestDayIndex = parseInt(day)
    }
  })

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const bestDay = {
    day: dayNames[bestDayIndex],
    avgHours: Number(bestDayAvg.toFixed(1)),
  }

  // Calculate peak hours (find 3-hour window with most sessions)
  const hourCounts: { [key: number]: number } = {}
  sessions.forEach(session => {
    const hour = session.startTime.getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  // Find best 3-hour window
  let bestWindowStart = 0
  let bestWindowCount = 0
  for (let hour = 0; hour <= 21; hour++) {
    const windowCount = (hourCounts[hour] || 0) + (hourCounts[hour + 1] || 0) + (hourCounts[hour + 2] || 0)
    if (windowCount > bestWindowCount) {
      bestWindowCount = windowCount
      bestWindowStart = hour
    }
  }

  const peakHours = {
    range: `${formatHour(bestWindowStart)}-${formatHour(bestWindowStart + 3)}`,
    percentage: Math.round((bestWindowCount / sessions.length) * 100),
  }

  // Calculate completion rate of planned sessions
  const plannedSessions = sessions.filter(s => s.isPlanned)
  const completionRate = plannedSessions.length > 0
    ? Math.round((plannedSessions.length / sessions.length) * 100)
    : 0

  return {
    bestDay,
    peakHours,
    completionRate,
  }
}

/**
 * Format hour number to AM/PM string
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'
  if (hour < 12) return `${hour} AM`
  return `${hour - 12} PM`
}
