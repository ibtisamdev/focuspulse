import { Card, CardContent } from '@/components/ui/card'
import { Clock, Target, Flame } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card className="bg-[#18181b] border-zinc-800 hover:bg-zinc-900/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-400">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-semibold text-zinc-50 mb-1">{value}</div>
        <p className="text-xs text-zinc-500">{change}</p>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  focusTime: string
  sessionsToday: number
  streak: number
  target?: string
}

export function StatsCards({ focusTime, sessionsToday, streak, target = "12h" }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Focus Time Today"
        value={focusTime || "0m"}
        change={`Weekly goal: ${target}`}
        icon={<Clock className="h-4 w-4 text-zinc-400" />}
      />
      <StatCard
        title="Sessions Today"
        value={sessionsToday.toString()}
        change={sessionsToday === 0 ? "Start your first session" : `${sessionsToday} completed`}
        icon={<Target className="h-4 w-4 text-zinc-400" />}
      />
      <StatCard
        title="Streak"
        value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
        change={streak > 0 ? "Keep it up!" : "Start a session today!"}
        icon={<Flame className="h-4 w-4 text-zinc-400" />}
      />
    </div>
  )
}
