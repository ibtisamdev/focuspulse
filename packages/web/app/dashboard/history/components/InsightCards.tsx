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

export function InsightCards() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <InsightCard
        icon={<Home className="h-4 w-4 text-zinc-400" />}
        label="Best Day"
        value="Tuesday"
        description="2.3h avg deep work"
      />
      <InsightCard
        icon={<Clock className="h-4 w-4 text-zinc-400" />}
        label="Peak Hours"
        value="9-11 AM"
        description="68% of sessions"
      />
      <InsightCard
        icon={<CheckCircle className="h-4 w-4 text-zinc-400" />}
        label="Completion"
        value="92%"
        description="Of planned sessions"
      />
    </div>
  )
}
