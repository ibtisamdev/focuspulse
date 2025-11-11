import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SessionCardProps {
  title: string
  startTime: string
  endTime: string
  duration: string
  type: 'planned' | 'adhoc'
  notes?: string
  onClick?: () => void
}

export function SessionCard({
  title,
  startTime,
  endTime,
  duration,
  type,
  notes,
  onClick,
}: SessionCardProps) {
  return (
    <div className="relative pl-6">
      {/* Timeline Dot */}
      <div className="absolute left-0 top-1.5 -translate-x-[9px] h-3 w-3 rounded-full bg-zinc-700 border-2 border-[#09090b]" />

      {/* Session Card */}
      <Card
        className={cn(
          "border-zinc-800 hover:bg-zinc-900/50 transition-colors",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-zinc-50 mb-1">{title}</h3>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{startTime} - {endTime}</span>
                <span>•</span>
                <span className="text-zinc-300">{duration}</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="px-2 py-1 bg-zinc-800 border-zinc-700 text-zinc-300 text-xs"
            >
              {type === 'planned' ? 'Planned' : 'Ad-hoc'}
            </Badge>
          </div>
          {notes && (
            <p className="text-xs text-zinc-500">{notes}</p>
          )}
        </div>
      </Card>
    </div>
  )
}
