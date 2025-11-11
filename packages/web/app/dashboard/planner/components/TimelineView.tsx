'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlannerEvent } from '@/lib/types/planner';
import { formatDate, generateTimeSlots, getEventsForDate, getTodayISODate, getCurrentTimePosition, getCurrentTimeFormatted } from '@/lib/utils/planner';
import { EventBlock } from './EventBlock';

interface TimelineViewProps {
  selectedDate: string;
  events: PlannerEvent[];
  onEventClick?: (event: PlannerEvent) => void;
  onAddEvent?: (time?: string, day?: number) => void;
  onDeleteEvent?: (event: PlannerEvent) => void;
  onStartSession?: (event: PlannerEvent) => void;
}

export function TimelineView({
  selectedDate,
  events,
  onEventClick,
  onAddEvent,
  onDeleteEvent,
  onStartSession
}: TimelineViewProps) {
  const timeSlots = generateTimeSlots();
  const dayEvents = getEventsForDate(events, selectedDate);
  const isToday = selectedDate === getTodayISODate();

  // Get day of week from selected date
  const selectedDayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();

  // Current time position state (updates every minute)
  const [currentTimePos, setCurrentTimePos] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    if (!isToday) return;

    const updateTime = () => {
      setCurrentTimePos(getCurrentTimePosition());
      setCurrentTime(getCurrentTimeFormatted());
    };

    // Initial update
    updateTime();

    // Update every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [isToday]);

  const handleTimeSlotClick = (hour: number) => {
    if (onAddEvent) {
      const timeString = `${String(hour).padStart(2, '0')}:00`;
      onAddEvent(timeString, selectedDayOfWeek);
    }
  };

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

              {/* Clickable time slot area */}
              <div
                className="flex-1 relative cursor-pointer hover:bg-zinc-800/20 transition-colors rounded-sm"
                onClick={() => handleTimeSlotClick(slot.hour)}
                title="Click to add event"
              ></div>
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
                onDelete={onDeleteEvent}
                onStartSession={onStartSession}
              />
            ))}
          </div>
        </div>

        {/* Current Time Indicator (only show for today) */}
        {isToday && currentTimePos !== null && (
          <div
            className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
            style={{ top: `${currentTimePos}px` }}
          >
            <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-zinc-50 border-2 border-zinc-200/50 shadow-lg shadow-zinc-50/80 animate-pulse" />
            <div className="w-full border-t-2 border-zinc-50/80 shadow-[0_0_15px_rgba(250,250,250,0.4)]" />
            <div className="absolute left-6 -top-2.5 text-[10px] font-medium text-zinc-50 bg-[#18181b] px-1.5 py-0.5 rounded border border-zinc-50/30">
              {currentTime}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
