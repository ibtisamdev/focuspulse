import { Separator } from '@/components/ui/separator'

interface SessionStatsProps {
  sessionsToday: number
  focusTime: string
  target: string
}

/**
 * SessionStats Component
 *
 * Displays user's daily stats below the timer
 * Server component - fetches fresh data
 */
export function SessionStats({
  sessionsToday,
  focusTime,
  target,
}: SessionStatsProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
      <div className="text-center">
        <div className="text-xs text-zinc-500 mb-1">Sessions Today</div>
        <div className="text-xl sm:text-2xl font-semibold text-zinc-400">
          {sessionsToday}
        </div>
      </div>

      <Separator orientation="vertical" className="h-10 sm:h-12 bg-zinc-800" />

      <div className="text-center">
        <div className="text-xs text-zinc-500 mb-1">Focus Time</div>
        <div className="text-xl sm:text-2xl font-semibold text-zinc-400">{focusTime}</div>
      </div>

      <Separator orientation="vertical" className="h-10 sm:h-12 bg-zinc-800" />

      <div className="text-center">
        <div className="text-xs text-zinc-500 mb-1">Target</div>
        <div className="text-xl sm:text-2xl font-semibold text-zinc-400">{target}</div>
      </div>
    </div>
  )
}
