'use client';

import { DayOfWeek } from '@/lib/types/planner';
import { cn } from '@/lib/utils';

interface DayTabsProps {
  days: DayOfWeek[];
  selectedDate: string;
  onSelectDay: (date: string) => void;
}

export function DayTabs({ days, selectedDate, onSelectDay }: DayTabsProps) {
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-2 mb-6">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isActive = day.isoDate === selectedDate;
          const isToday = day.isToday;

          return (
            <button
              key={day.isoDate}
              onClick={() => onSelectDay(day.isoDate)}
              className={cn(
                'px-3 py-2 rounded-md text-xs font-medium border transition-colors',
                'hover:bg-zinc-800/50',
                isActive
                  ? 'bg-[#27272a] border-zinc-700'
                  : 'border-transparent'
              )}
            >
              <div className={cn(
                'transition-colors',
                isActive ? 'text-zinc-50' : 'text-zinc-400'
              )}>
                {day.dayName}
              </div>
              <div className={cn(
                'text-[10px] mt-0.5 transition-colors',
                isToday ? 'text-blue-400 font-semibold' : 'text-zinc-500'
              )}>
                {day.monthName} {day.dayNumber}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
