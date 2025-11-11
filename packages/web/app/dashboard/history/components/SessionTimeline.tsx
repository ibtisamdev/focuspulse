'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TimelineSection } from './TimelineSection'
import { useState, useTransition } from 'react'
import { getSessionsHistory } from '@/app/actions/history'

interface SessionData {
  id: string
  title: string
  startTime: string
  endTime?: string
  duration: number
  notes?: string | null
  isPlanned: boolean
}

interface SessionTimelineProps {
  initialSessions: { [key: string]: SessionData[] }
  totalCount: number
  hasMore: boolean
}

export function SessionTimeline({ initialSessions, totalCount, hasMore: initialHasMore }: SessionTimelineProps) {
  const [sessions, setSessions] = useState(initialSessions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'planned' | 'adhoc'>('all')
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [currentOffset, setCurrentOffset] = useState(20)
  const [isPending, startTransition] = useTransition()

  const handleLoadMore = () => {
    startTransition(async () => {
      const moreData = await getSessionsHistory({
        searchQuery,
        type: filterType,
        limit: 20,
        offset: currentOffset,
      })

      // Merge new sessions with existing ones
      const mergedSessions = { ...sessions }
      Object.entries(moreData.groupedSessions).forEach(([date, newSessions]) => {
        if (mergedSessions[date]) {
          mergedSessions[date] = [...mergedSessions[date], ...newSessions]
        } else {
          mergedSessions[date] = newSessions
        }
      })

      setSessions(mergedSessions)
      setHasMore(moreData.hasMore)
      setCurrentOffset(currentOffset + 20)
    })
  }

  const handleFilterChange = (value: string) => {
    const newFilterType = value as 'all' | 'planned' | 'adhoc'
    setFilterType(newFilterType)

    startTransition(async () => {
      const newData = await getSessionsHistory({
        searchQuery,
        type: newFilterType,
        limit: 20,
        offset: 0,
      })
      setSessions(newData.groupedSessions)
      setHasMore(newData.hasMore)
      setCurrentOffset(20)
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // Debounced search could be added here
    // For now, we'll filter client-side for immediate feedback
  }

  // Filter sessions client-side for search
  const filteredSessions: { [key: string]: SessionData[] } = {}
  Object.entries(sessions).forEach(([date, dateSessions]) => {
    const filtered = dateSessions.filter((session) => {
      const matchesSearch = searchQuery.trim() === '' ||
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    if (filtered.length > 0) {
      filteredSessions[date] = filtered
    }
  })

  const hasNoSessions = Object.keys(filteredSessions).length === 0

  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-50">Session Timeline</h2>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-zinc-300 placeholder-zinc-500 w-40 h-9"
            />
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-300">All Types</SelectItem>
                <SelectItem value="planned" className="text-zinc-300">Planned</SelectItem>
                <SelectItem value="adhoc" className="text-zinc-300">Ad-hoc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        {hasNoSessions ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-sm">
              {searchQuery ? 'No sessions found matching your search.' : 'No sessions yet. Start your first focus session!'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {Object.entries(filteredSessions).map(([date, dateSessions]) => (
                <TimelineSection
                  key={date}
                  date={date}
                  isToday={date === 'Today'}
                  sessions={dateSessions.map(session => ({
                    id: session.id,
                    title: session.title,
                    startTime: session.startTime,
                    endTime: session.endTime || 'N/A',
                    duration: `${Math.floor(session.duration / 60)}h ${session.duration % 60}m`,
                    type: session.isPlanned ? 'planned' as const : 'adhoc' as const,
                    notes: session.notes || undefined,
                  }))}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isPending}
                  className="text-xs text-zinc-400 hover:text-zinc-300 border-zinc-800 hover:bg-zinc-800/50 h-auto px-4 py-2"
                >
                  {isPending ? 'Loading...' : 'Load Earlier Sessions'}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
