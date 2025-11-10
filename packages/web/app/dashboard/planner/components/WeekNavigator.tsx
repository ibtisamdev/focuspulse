'use client';

import { Button } from '@/components/ui/button';
import { WeekData } from '@/lib/types/planner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigatorProps {
  weekData: WeekData;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export function WeekNavigator({ weekData, onPreviousWeek, onNextWeek }: WeekNavigatorProps) {
  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousWeek}
          className="h-8 w-8 border-zinc-800 hover:bg-zinc-800/50"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-400" />
          <span className="sr-only">Previous week</span>
        </Button>

        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-50">{weekData.dateRange}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Week {weekData.weekNumber}</p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextWeek}
          className="h-8 w-8 border-zinc-800 hover:bg-zinc-800/50"
        >
          <ChevronRight className="h-4 w-4 text-zinc-400" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
    </div>
  );
}
