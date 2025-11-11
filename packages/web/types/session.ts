export interface SessionData {
  id: string
  title: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  type: 'planned' | 'adhoc'
  notes?: string
  completed: boolean
}

export interface WeeklyData {
  day: string
  hours: number
  percentage: number
}

export interface SessionStats {
  totalHours: number
  currentStreak: number
  totalSessions: number
  avgDuration: number
}

export interface InsightData {
  icon: string
  label: string
  value: string
  description: string
}
