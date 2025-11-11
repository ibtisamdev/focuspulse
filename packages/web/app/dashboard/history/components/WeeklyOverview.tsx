'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

interface DayData {
  day: string
  hours: number
  date: string
}

interface WeeklyOverviewProps {
  thisWeekData: DayData[]
  lastWeekData: DayData[]
}

export function WeeklyOverview({ thisWeekData, lastWeekData }: WeeklyOverviewProps) {
  const [selectedWeek, setSelectedWeek] = useState<'this' | 'last'>('this')
  const data = selectedWeek === 'this' ? thisWeekData : lastWeekData

  // Calculate max hours for percentage calculation
  const maxHours = Math.max(...data.map(d => d.hours), 1) // At least 1 to avoid division by zero

  return (
    <Card className="bg-[#18181b] border-zinc-800 mb-8">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-50">Weekly Overview</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWeek('this')}
              className={`text-xs border-zinc-800 h-auto px-3 py-1.5 ${
                selectedWeek === 'this'
                  ? 'text-zinc-50 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWeek('last')}
              className={`text-xs border-zinc-800 h-auto px-3 py-1.5 ${
                selectedWeek === 'last'
                  ? 'text-zinc-50 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              Last Week
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = maxHours > 0 ? (item.hours / maxHours) * 100 : 0
            return (
              <div key={item.day} className="flex items-center gap-4">
                <span className="text-xs text-zinc-400 w-12">{item.day}</span>
                <div className="flex-1">
                  <Progress
                    value={percentage}
                    className="h-8 bg-zinc-900 border border-zinc-800"
                  />
                </div>
                <span className="text-xs text-zinc-400 w-12 text-right">
                  {item.hours > 0 ? `${item.hours}h` : '0h'}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
