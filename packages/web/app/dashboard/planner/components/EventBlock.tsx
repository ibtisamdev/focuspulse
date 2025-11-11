'use client';

import { useState } from 'react';
import { EventColor, PlannerEvent } from '@/lib/types/planner';
import { calculateEventPosition, formatTimeRange } from '@/lib/utils/planner';
import { cn } from '@/lib/utils';
import { X, Play } from 'lucide-react';

interface EventBlockProps {
  event: PlannerEvent;
  onClick?: (event: PlannerEvent) => void;
  onDelete?: (event: PlannerEvent) => void;
  onStartSession?: (event: PlannerEvent) => void;
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

export function EventBlock({ event, onClick, onDelete, onStartSession }: EventBlockProps) {
  const { top, height } = calculateEventPosition(event.startTime, event.endTime);
  const colors = colorStyles[event.color];
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onDelete) {
      onDelete(event);
    }
  };

  const handleStartSession = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onStartSession) {
      onStartSession(event);
    }
  };

  return (
    <div
      className={cn(
        'absolute left-16 right-0 rounded-md border px-2 py-1.5',
        'cursor-pointer transition-all duration-200',
        'hover:opacity-90 hover:-translate-x-0.5',
        'overflow-hidden group',
        colors.bg,
        colors.border
      )}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        minHeight: '30px',
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action buttons (shown on hover) */}
      {isHovered && (
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {/* Start Session button */}
          {onStartSession && (
            <button
              onClick={handleStartSession}
              className={cn(
                'p-0.5 rounded',
                'bg-blue-600/80 hover:bg-blue-600',
                'text-white'
              )}
              title="Start focus session"
            >
              <Play className="w-3 h-3" />
            </button>
          )}

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              className={cn(
                'p-0.5 rounded',
                'bg-red-600/80 hover:bg-red-600',
                'text-white'
              )}
              title="Delete event"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {height <= 45 ? (
        // Compact view: title and time on same line for small events
        <div className={cn('text-xs font-medium truncate pr-6', colors.text)}>
          {event.title}
          <span className={cn('ml-2 font-normal', colors.subtext)}>
            {formatTimeRange(event.startTime, event.endTime)}
          </span>
        </div>
      ) : (
        // Full view: title and time on separate lines
        <>
          <div className={cn('text-xs font-medium truncate pr-6', colors.text)}>
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
        </>
      )}
    </div>
  );
}
