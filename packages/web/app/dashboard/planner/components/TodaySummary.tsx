'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DaySummary } from '@/lib/types/planner';

interface TodaySummaryProps {
  summary: DaySummary;
}

export function TodaySummary({ summary }: TodaySummaryProps) {
  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-50">Today's Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Total Events</span>
          <span className="text-sm font-medium text-zinc-50">{summary.totalEvents}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Scheduled Time</span>
          <span className="text-sm font-medium text-zinc-50">{summary.scheduledTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Free Time</span>
          <span className="text-sm font-medium text-zinc-50">{summary.freeTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
