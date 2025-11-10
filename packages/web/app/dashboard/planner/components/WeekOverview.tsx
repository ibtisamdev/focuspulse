'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DayOfWeek, EventColor, PlannerEvent } from '@/lib/types/planner';
import { groupEventsByDate } from '@/lib/utils/planner';
import { cn } from '@/lib/utils';

interface WeekOverviewProps {
  days: DayOfWeek[];
  events: PlannerEvent[];
}

const colorMap: Record<EventColor, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  zinc: 'bg-zinc-700',
};

export function WeekOverview({ days, events }: WeekOverviewProps) {
  const eventsByDate = groupEventsByDate(events);

  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-50">Week Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {days.map((day) => {
          const dayEvents = eventsByDate[day.isoDate] || [];
          const eventCount = dayEvents.length;

          return (
            <div key={day.isoDate} className="flex items-center gap-3">
              <div className="w-12 text-xs text-zinc-400">{day.dayName}</div>
              <div className="flex-1 flex items-center gap-1">
                {dayEvents.length > 0 ? (
                  dayEvents.slice(0, 6).map((event, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      className={cn('h-1.5 w-1.5 rounded-full', colorMap[event.color])}
                      title={event.title}
                    />
                  ))
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-700/50" />
                )}
              </div>
              <div className="text-xs text-zinc-500">{eventCount}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
