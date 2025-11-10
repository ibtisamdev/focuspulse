'use client';

import { EventColor, PlannerEvent } from '@/lib/types/planner';
import { calculateEventPosition, formatTimeRange } from '@/lib/utils/planner';
import { cn } from '@/lib/utils';

interface EventBlockProps {
  event: PlannerEvent;
  onClick?: (event: PlannerEvent) => void;
}

const colorStyles: Record<EventColor, { bg: string; border: string; text: string; subtext: string }> = {
  blue: {
    bg: 'bg-blue-950/50',
    border: 'border-blue-900/50',
    text: 'text-blue-200',
    subtext: 'text-blue-300/70',
  },
  purple: {
    bg: 'bg-purple-950/50',
    border: 'border-purple-900/50',
    text: 'text-purple-200',
    subtext: 'text-purple-300/70',
  },
  green: {
    bg: 'bg-green-950/50',
    border: 'border-green-900/50',
    text: 'text-green-200',
    subtext: 'text-green-300/70',
  },
  orange: {
    bg: 'bg-orange-950/50',
    border: 'border-orange-900/50',
    text: 'text-orange-200',
    subtext: 'text-orange-300/70',
  },
  zinc: {
    bg: 'bg-zinc-800/50',
    border: 'border-zinc-700/50',
    text: 'text-zinc-300',
    subtext: 'text-zinc-400',
  },
};

export function EventBlock({ event, onClick }: EventBlockProps) {
  const { top, height } = calculateEventPosition(event.startTime, event.endTime);
  const colors = colorStyles[event.color];

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={cn(
        'absolute left-16 right-0 rounded-md border px-2 py-1.5',
        'cursor-pointer transition-all duration-200',
        'hover:opacity-90 hover:-translate-x-0.5',
        colors.bg,
        colors.border
      )}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        minHeight: '30px',
      }}
      onClick={handleClick}
    >
      <div className={cn('text-xs font-medium', colors.text)}>
        {event.title}
      </div>
      <div className={cn('text-[10px] mt-0.5', colors.subtext)}>
        {formatTimeRange(event.startTime, event.endTime)}
      </div>
      {event.description && height > 60 && (
        <div className={cn('text-[10px] mt-1', colors.subtext, 'opacity-50')}>
          {event.description}
        </div>
      )}
    </div>
  );
}
