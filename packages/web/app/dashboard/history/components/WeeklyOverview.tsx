'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

interface DayData {
  day: string
  hours: string
  percentage: number
}

const thisWeekData: DayData[] = [
  { day: 'Mon', hours: '2.1h', percentage: 85 },
  { day: 'Tue', hours: '2.3h', percentage: 92 },
  { day: 'Wed', hours: '2.0h', percentage: 78 },
  { day: 'Thu', hours: '2.2h', percentage: 88 },
  { day: 'Fri', hours: '2.4h', percentage: 95 },
  { day: 'Sat', hours: '1.1h', percentage: 45 },
  { day: 'Sun', hours: '0.9h', percentage: 38 },
]

const lastWeekData: DayData[] = [
  { day: 'Mon', hours: '1.8h', percentage: 72 },
  { day: 'Tue', hours: '2.5h', percentage: 95 },
  { day: 'Wed', hours: '2.2h', percentage: 88 },
  { day: 'Thu', hours: '1.9h', percentage: 76 },
  { day: 'Fri', hours: '2.1h', percentage: 84 },
  { day: 'Sat', hours: '0.8h', percentage: 32 },
  { day: 'Sun', hours: '1.2h', percentage: 48 },
]

export function WeeklyOverview() {
  const [selectedWeek, setSelectedWeek] = useState<'this' | 'last'>('this')
  const data = selectedWeek === 'this' ? thisWeekData : lastWeekData

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
          {data.map((item) => (
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
