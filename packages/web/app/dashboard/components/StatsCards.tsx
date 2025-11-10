import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle, Flame } from 'lucide-react'

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

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Focus Time"
        value="4h 32m"
        change="+12% from last week"
        icon={<Clock className="h-4 w-4 text-zinc-400" />}
      />
      <StatCard
        title="Tasks Done"
        value="24"
        change="8 remaining today"
        icon={<CheckCircle className="h-4 w-4 text-zinc-400" />}
      />
      <StatCard
        title="Streak"
        value="7 days"
        change="Keep it up!"
        icon={<Flame className="h-4 w-4 text-zinc-400" />}
      />
    </div>
  )
}
