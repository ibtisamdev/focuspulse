import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface ActivityData {
  day: string
  hours: string
  percentage: number
}

const activityData: ActivityData[] = [
  { day: 'Mon', hours: '5.2h', percentage: 85 },
  { day: 'Tue', hours: '5.8h', percentage: 92 },
  { day: 'Wed', hours: '4.9h', percentage: 78 },
  { day: 'Thu', hours: '5.5h', percentage: 88 },
  { day: 'Fri', hours: '6.1h', percentage: 95 },
  { day: 'Sat', hours: '2.8h', percentage: 45 },
  { day: 'Sun', hours: '2.4h', percentage: 38 },
]

export function WeeklyActivity() {
  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-50">Weekly Activity</h2>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-zinc-400 hover:text-zinc-300 border-zinc-800 hover:bg-zinc-800/50 h-auto px-3 py-1.5"
          >
            Last 7 days
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="space-y-4">
          {activityData.map((item) => (
            <div key={item.day} className="flex items-center gap-4">
              <span className="text-xs text-zinc-400 w-12">{item.day}</span>
              <div className="flex-1">
                <Progress
                  value={item.percentage}
                  className="h-8 bg-zinc-900 border border-zinc-800"
                />
              </div>
              <span className="text-xs text-zinc-400 w-12 text-right">{item.hours}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
