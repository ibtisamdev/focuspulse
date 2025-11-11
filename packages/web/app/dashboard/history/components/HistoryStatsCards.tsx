import { Card } from '@/components/ui/card'
import { Clock, Flame, CheckCircle, BarChart3 } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="bg-[#18181b] border-zinc-800 hover:bg-zinc-900/50 transition-colors p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-zinc-400">{label}</span>
      </div>
      <p className="text-xl font-semibold text-zinc-50">{value}</p>
    </Card>
  )
}

interface HistoryStatsCardsProps {
  totalHours: number
  streak: number
  sessionCount: number
  avgLength: number
}

export function HistoryStatsCards({ totalHours, streak, sessionCount, avgLength }: HistoryStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<Clock className="h-3.5 w-3.5 text-zinc-400" />}
        label="Total Hours"
        value={`${totalHours}h`}
      />
      <StatCard
        icon={<Flame className="h-3.5 w-3.5 text-zinc-400" />}
        label="Streak"
        value={`${streak} ${streak === 1 ? 'day' : 'days'}`}
      />
      <StatCard
        icon={<CheckCircle className="h-3.5 w-3.5 text-zinc-400" />}
        label="Sessions"
        value={sessionCount.toString()}
      />
      <StatCard
        icon={<BarChart3 className="h-3.5 w-3.5 text-zinc-400" />}
        label="Avg Length"
        value={`${avgLength} min`}
      />
    </div>
  )
}
