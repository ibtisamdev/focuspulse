'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { PlannedBlock } from '@prisma/client'
import type { PlannerEvent } from '@/lib/types/planner'
import {
  getWeekData,
  getPreviousWeek,
  getNextWeek,
  getTodayISODate,
  calculateDaySummary,
  getUpcomingEvents,
} from '@/lib/utils/planner'
import { plannedBlocksToWeekEvents } from '@/lib/utils/planner-db'
import { createSession } from '@/app/actions/session'
import { WeekNavigator } from './WeekNavigator'
import { DayTabs } from './DayTabs'
import { TimelineView } from './TimelineView'
import { TodaySummary } from './TodaySummary'
import { QuickAddEvent } from './QuickAddEvent'
import { UpcomingEvents } from './UpcomingEvents'
import { WeekOverview } from './WeekOverview'
import { EventModal } from './EventModal'
import { DeleteEventDialog } from './DeleteEventDialog'

interface PlannerClientProps {
  initialBlocks: PlannedBlock[]
}

export function PlannerClient({ initialBlocks }: PlannerClientProps) {
  const router = useRouter()
  const [weekData, setWeekData] = useState(() => getWeekData(new Date()))
  const [selectedDate, setSelectedDate] = useState(getTodayISODate())

  // Modal state
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit'>('create')
  const [selectedBlock, setSelectedBlock] = useState<PlannedBlock | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [defaultTime, setDefaultTime] = useState<string>()
  const [defaultDay, setDefaultDay] = useState<number>()

  // Convert PlannedBlocks to PlannerEvents for the current week
  const events: PlannerEvent[] = useMemo(() => {
    return plannedBlocksToWeekEvents(initialBlocks, weekData.startDate)
  }, [initialBlocks, weekData.startDate])

  const handlePreviousWeek = () => {
    const prevWeek = getPreviousWeek(weekData)
    setWeekData(prevWeek)
    setSelectedDate(prevWeek.days[0].isoDate)
  }

  const handleNextWeek = () => {
    const nextWeek = getNextWeek(weekData)
    setWeekData(nextWeek)
    setSelectedDate(nextWeek.days[0].isoDate)
  }

  const handleSelectDay = (date: string) => {
    setSelectedDate(date)
  }

  const handleEventClick = (event: PlannerEvent) => {
    // Find the corresponding PlannedBlock
    const block = initialBlocks.find((b) => b.id === event.id)
    if (block) {
      setSelectedBlock(block)
      setEventModalMode('edit')
      setEventModalOpen(true)
    }
  }

  const handleAddEvent = (time?: string, day?: number) => {
    setSelectedBlock(null)
    setDefaultTime(time)
    setDefaultDay(day)
    setEventModalMode('create')
    setEventModalOpen(true)
  }

  const handleDeleteEvent = (event: PlannerEvent) => {
    const block = initialBlocks.find((b) => b.id === event.id)
    if (block) {
      setSelectedBlock(block)
      setDeleteDialogOpen(true)
    }
  }

  const handleStartSession = async (event: PlannerEvent) => {
    const result = await createSession(event.title, true) // true = isPlanned

    if ('error' in result) {
      alert(result.error || 'Failed to start session. Please try again.')
      return
    }

    if (result.success && result.data) {
      // Redirect to the active session page
      router.push(`/dashboard/session/${result.data.id}`)
    }
  }

  // Calculate summary for selected day
  const daySummary = useMemo(
    () => calculateDaySummary(events, selectedDate),
    [events, selectedDate]
  )

  // Get upcoming events
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events, selectedDate, 10),
    [events, selectedDate]
  )

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-50 mb-2">
            Weekly Planner
          </h1>
          <p className="text-sm text-zinc-400">
            Plan and schedule your week with timeline view
          </p>
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
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
              onStartSession={handleStartSession}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <TodaySummary summary={daySummary} />

            {/* Quick Add Event */}
            <QuickAddEvent
              onAddEvent={() => {
                const selectedDay = weekData.days.find(d => d.isoDate === selectedDate)
                handleAddEvent(undefined, selectedDay?.date.getDay())
              }}
            />

            {/* Upcoming Events */}
            <UpcomingEvents events={upcomingEvents} limit={4} />

            {/* Week Overview */}
            <WeekOverview days={weekData.days} events={events} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <EventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        mode={eventModalMode}
        existingBlock={selectedBlock || undefined}
        defaultTime={defaultTime}
        defaultDay={defaultDay}
      />

      <DeleteEventDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        block={selectedBlock}
      />
    </>
  )
}
