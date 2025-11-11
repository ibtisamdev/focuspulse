import { Card } from '@/components/ui/card'
import { Home, Clock, CheckCircle } from 'lucide-react'

interface InsightCardProps {
  icon: React.ReactNode
  label: string
  value: string
  description: string
}

function InsightCard({ icon, label, value, description }: InsightCardProps) {
  return (
    <Card className="bg-[#18181b] border-zinc-800 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs text-zinc-400">{label}</p>
          <p className="text-sm font-medium text-zinc-50">{value}</p>
        </div>
      </div>
      <p className="text-xs text-zinc-500">{description}</p>
    </Card>
  )
}

interface InsightCardsProps {
  bestDay: {
    day: string
    avgHours: number
  }
  peakHours: {
    range: string
    percentage: number
  }
  completionRate: number
}

export function InsightCards({ bestDay, peakHours, completionRate }: InsightCardsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <InsightCard
        icon={<Home className="h-4 w-4 text-zinc-400" />}
        label="Best Day"
        value={bestDay.day}
        description={bestDay.avgHours > 0 ? `${bestDay.avgHours}h avg deep work` : 'No data yet'}
      />
      <InsightCard
        icon={<Clock className="h-4 w-4 text-zinc-400" />}
        label="Peak Hours"
        value={peakHours.range}
        description={peakHours.percentage > 0 ? `${peakHours.percentage}% of sessions` : 'No data yet'}
      />
      <InsightCard
        icon={<CheckCircle className="h-4 w-4 text-zinc-400" />}
        label="Completion"
        value={completionRate > 0 ? `${completionRate}%` : '0%'}
        description="Of planned sessions"
      />
    </div>
  )
}
