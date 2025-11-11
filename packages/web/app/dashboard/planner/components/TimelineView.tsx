'use client';

import { Button } from '@/components/ui/button';
import { PlannerEvent } from '@/lib/types/planner';
import { formatDate, generateTimeSlots, getEventsForDate, getTodayISODate } from '@/lib/utils/planner';
import { EventBlock } from './EventBlock';

interface TimelineViewProps {
  selectedDate: string;
  events: PlannerEvent[];
  onEventClick?: (event: PlannerEvent) => void;
}

export function TimelineView({ selectedDate, events, onEventClick }: TimelineViewProps) {
  const timeSlots = generateTimeSlots();
  const dayEvents = getEventsForDate(events, selectedDate);
  const isToday = selectedDate === getTodayISODate();

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-50">
          {formatDate(selectedDate, 'long')}
        </h2>
        {isToday && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-zinc-800 hover:bg-zinc-800/50"
          >
            Today
          </Button>
        )}
      </div>

      {/* Timeline Grid */}
      <div className="space-y-0 relative">
        {/* Time slot grid for visual structure */}
        {timeSlots.map((slot, index) => {
          const isLastSlot = index === timeSlots.length - 1;

          return (
            <div
              key={slot.hour}
              className={`flex min-h-[60px] relative ${!isLastSlot ? 'border-b border-zinc-800/50' : ''}`}
            >
              {/* Time Label */}
              <div className="w-16 text-xs text-zinc-500 py-2">
                {slot.label}
              </div>

              {/* Empty space for timeline */}
              <div className="flex-1 relative"></div>
            </div>
          );
        })}

        {/* Events container - absolute positioned over the entire timeline */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: `${timeSlots.length * 60}px` }}
        >
          <div className="relative h-full pointer-events-auto">
            {dayEvents.map(event => (
              <EventBlock
                key={event.id}
                event={event}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
