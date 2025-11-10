'use client';

import { useState, useMemo } from 'react';
import { PlannerEvent } from '@/lib/types/planner';
import {
  getWeekData,
  getPreviousWeek,
  getNextWeek,
  getTodayISODate,
  calculateDaySummary,
  getUpcomingEvents,
} from '@/lib/utils/planner';
import { WeekNavigator } from './components/WeekNavigator';
import { DayTabs } from './components/DayTabs';
import { TimelineView } from './components/TimelineView';
import { TodaySummary } from './components/TodaySummary';
import { QuickAddEvent } from './components/QuickAddEvent';
import { UpcomingEvents } from './components/UpcomingEvents';
import { WeekOverview } from './components/WeekOverview';
import { sampleEvents } from '@/lib/data/sample-events';

export default function PlannerPage() {
  const [weekData, setWeekData] = useState(() => getWeekData(new Date()));
  const [selectedDate, setSelectedDate] = useState(getTodayISODate());
  const [events] = useState<PlannerEvent[]>(sampleEvents);

  const handlePreviousWeek = () => {
    const prevWeek = getPreviousWeek(weekData);
    setWeekData(prevWeek);
    // Set selected date to the first day of the new week
    setSelectedDate(prevWeek.days[0].isoDate);
  };

  const handleNextWeek = () => {
    const nextWeek = getNextWeek(weekData);
    setWeekData(nextWeek);
    // Set selected date to the first day of the new week
    setSelectedDate(nextWeek.days[0].isoDate);
  };

  const handleSelectDay = (date: string) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: PlannerEvent) => {
    console.log('Event clicked:', event);
    // TODO: Implement event detail modal
  };

  const handleAddEvent = () => {
    console.log('Add event clicked');
    // TODO: Implement add event modal
  };

  // Calculate summary for selected day
  const daySummary = useMemo(
    () => calculateDaySummary(events, selectedDate),
    [events, selectedDate]
  );

  // Get upcoming events
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events, selectedDate, 10),
    [events, selectedDate]
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-50 mb-2">Weekly Planner</h1>
        <p className="text-sm text-zinc-400">Plan and schedule your week with timeline view</p>
      </div>

      {/* Week Navigator */}
      <WeekNavigator
        weekData={weekData}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      {/* Day Tabs */}
      <DayTabs
        days={weekData.days}
        selectedDate={selectedDate}
        onSelectDay={handleSelectDay}
      />

      {/* Main Layout: Timeline + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline View */}
        <div className="lg:col-span-2">
          <TimelineView
            selectedDate={selectedDate}
            events={events}
            onEventClick={handleEventClick}
          />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <TodaySummary summary={daySummary} />

          {/* Quick Add Event */}
          <QuickAddEvent onAddEvent={handleAddEvent} />

          {/* Upcoming Events */}
          <UpcomingEvents events={upcomingEvents} limit={4} />

          {/* Week Overview */}
          <WeekOverview days={weekData.days} events={events} />
        </div>
      </div>
    </main>
  );
}
