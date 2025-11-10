'use client';

import { Plus } from 'lucide-react';

interface QuickAddEventProps {
  onAddEvent?: () => void;
}

export function QuickAddEvent({ onAddEvent }: QuickAddEventProps) {
  return (
    <button
      onClick={onAddEvent}
      className="w-full bg-[#18181b] border border-zinc-800 rounded-lg p-6 hover:bg-zinc-900/50 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <Plus className="h-[18px] w-[18px] text-zinc-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-50">Add Event</p>
          <p className="text-xs text-zinc-500">Schedule new event</p>
        </div>
      </div>
    </button>
  );
}
