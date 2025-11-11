import { SessionCard } from './SessionCard'
import { cn } from '@/lib/utils'

interface Session {
  id: string
  title: string
  startTime: string
  endTime: string
  duration: string
  type: 'planned' | 'adhoc'
  notes?: string
}

interface TimelineSectionProps {
  date: string
  isToday?: boolean
  sessions: Session[]
}

export function TimelineSection({ date, isToday = false, sessions }: TimelineSectionProps) {
  return (
    <div>
      {/* Date Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "text-xs font-medium px-2 py-1 rounded",
            isToday
              ? "text-zinc-50 bg-zinc-800"
              : "text-zinc-400 bg-zinc-900"
          )}
        >
          {date}
        </div>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Session List with Timeline */}
      <div className="space-y-3 pl-4 border-l-2 border-zinc-800">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            title={session.title}
            startTime={session.startTime}
            endTime={session.endTime}
            duration={session.duration}
            type={session.type}
            notes={session.notes}
          />
        ))}
      </div>
    </div>
  )
}
