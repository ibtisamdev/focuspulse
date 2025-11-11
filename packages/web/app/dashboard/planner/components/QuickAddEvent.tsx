'use client';

import { Plus } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';

interface QuickAddEventProps {
  onAddEvent?: () => void;
}

export function QuickAddEvent({ onAddEvent }: QuickAddEventProps) {
  return (
    <ActionButton
      icon={<Plus className="h-[18px] w-[18px] text-zinc-400" />}
      title="Add Event"
      description="Schedule new event"
      onClick={onAddEvent}
      className="w-full"
    />
  );
}
