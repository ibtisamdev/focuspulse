export type EventCategory = 'meeting' | 'work' | 'break' | 'personal' | 'review';

export type EventColor = 'blue' | 'purple' | 'green' | 'orange' | 'zinc';

export interface PlannerEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // Format: "HH:mm" (e.g., "09:00")
  endTime: string;   // Format: "HH:mm" (e.g., "10:30")
  date: string;      // Format: "YYYY-MM-DD"
  color: EventColor;
  category: EventCategory;
}

export interface TimeSlot {
  hour: number;      // 0-23
  label: string;     // "8:00 AM"
}

export interface DayOfWeek {
  date: Date;
  dayName: string;   // "Mon", "Tue", etc.
  dayNumber: number; // Day of month
  monthName: string; // "Nov", "Dec", etc.
  isToday: boolean;
  isoDate: string;   // "YYYY-MM-DD"
}

export interface WeekData {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  days: DayOfWeek[];
  dateRange: string; // "November 10 - November 16, 2025"
}

export interface DaySummary {
  totalEvents: number;
  scheduledMinutes: number;
  freeMinutes: number;
  scheduledTime: string; // "7h 30m"
  freeTime: string;      // "6h 30m"
}
