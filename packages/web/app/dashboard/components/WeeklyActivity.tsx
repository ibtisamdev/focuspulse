import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface WeeklyActivityData {
  day: string
  hours: number
  date: string
}

interface WeeklyActivityProps {
  weeklyData: WeeklyActivityData[]
  weeklyGoalHours?: number
}

export function WeeklyActivity({ weeklyData, weeklyGoalHours = 12 }: WeeklyActivityProps) {
  // Calculate daily goal (weekly goal / 7 days, with focus on weekdays)
  // Assume 5 working days, so divide by 5 for a more realistic daily target
  const dailyTargetHours = weeklyGoalHours / 5

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
            This week
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="space-y-4">
          {weeklyData.map((item) => {
            // Calculate percentage based on daily target
            const percentage = Math.min((item.hours / dailyTargetHours) * 100, 100)
            const hoursDisplay = item.hours > 0 ? `${item.hours.toFixed(1)}h` : '0h'

            return (
              <div key={item.day} className="flex items-center gap-4">
                <span className="text-xs text-zinc-400 w-12">{item.day}</span>
                <div className="flex-1">
                  <Progress
                    value={percentage}
                    className="h-8 bg-zinc-900 border border-zinc-800"
                  />
                </div>
                <span className="text-xs text-zinc-400 w-12 text-right">{hoursDisplay}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
