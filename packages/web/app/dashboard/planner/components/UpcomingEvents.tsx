'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventColor, PlannerEvent } from '@/lib/types/planner';
import { formatDate, formatTime12Hour, isSameDay, getTodayISODate } from '@/lib/utils/planner';
import { cn } from '@/lib/utils';

interface UpcomingEventsProps {
  events: PlannerEvent[];
  limit?: number;
}

const colorMap: Record<EventColor, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  zinc: 'bg-zinc-500',
};

export function UpcomingEvents({ events, limit = 4 }: UpcomingEventsProps) {
  const displayEvents = events.slice(0, limit);
  const todayDate = getTodayISODate();

  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-zinc-50">Upcoming</CardTitle>
        <a href="#" className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
          View all
        </a>
      </CardHeader>
      <CardContent className="space-y-0 divide-y divide-zinc-800">
        {displayEvents.length === 0 ? (
          <p className="text-sm text-zinc-500 py-3">No upcoming events</p>
        ) : (
          displayEvents.map((event) => {
            const isToday = isSameDay(event.date, todayDate);
            const eventDate = new Date(event.date);

            return (
              <div key={event.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className={cn('h-2 w-2 rounded-full mt-1.5', colorMap[event.color])} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-50">{event.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isToday ? 'Today' : formatDate(eventDate, 'short')} at {formatTime12Hour(event.startTime)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
