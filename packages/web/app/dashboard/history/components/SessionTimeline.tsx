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

// Mock data for sessions
const mockSessions = {
  today: [
    {
      id: '1',
      title: 'UI Design Sprint',
      startTime: '9:00 AM',
      endTime: '11:30 AM',
      duration: '2h 30m',
      type: 'planned' as const,
      notes: 'Completed dashboard mockups and component library setup.',
    },
  ],
  yesterday: [
    {
      id: '2',
      title: 'Code Review',
      startTime: '2:00 PM',
      endTime: '3:45 PM',
      duration: '1h 45m',
      type: 'adhoc' as const,
      notes: 'Reviewed feature branch PRs and provided detailed feedback.',
    },
    {
      id: '3',
      title: 'Documentation Writing',
      startTime: '9:00 AM',
      endTime: '10:30 AM',
      duration: '1h 30m',
      type: 'planned' as const,
      notes: 'Updated API documentation and added code examples.',
    },
  ],
  nov8: [
    {
      id: '4',
      title: 'Research & Planning',
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      duration: '1h 0m',
      type: 'adhoc' as const,
      notes: 'Researched state management solutions and evaluated different approaches.',
    },
    {
      id: '5',
      title: 'Feature Development',
      startTime: '10:00 AM',
      endTime: '12:15 PM',
      duration: '2h 15m',
      type: 'planned' as const,
      notes: 'Implemented user authentication flow with JWT tokens.',
    },
  ],
  nov7: [
    {
      id: '6',
      title: 'Bug Fixing Session',
      startTime: '3:00 PM',
      endTime: '5:30 PM',
      duration: '2h 30m',
      type: 'adhoc' as const,
      notes: 'Fixed critical production bugs affecting user registration flow.',
    },
    {
      id: '7',
      title: 'Team Sync Meeting',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      duration: '1h 0m',
      type: 'planned' as const,
      notes: 'Discussed sprint planning and reviewed team progress on key deliverables.',
    },
  ],
}

export function SessionTimeline() {
  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-50">Session Timeline</h2>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search..."
              className="bg-zinc-900 border-zinc-800 text-zinc-300 placeholder-zinc-500 w-40 h-9"
            />
            <Select defaultValue="all">
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
        <div className="space-y-8">
          <TimelineSection
            date="Today"
            isToday={true}
            sessions={mockSessions.today}
          />
          <TimelineSection
            date="Yesterday"
            sessions={mockSessions.yesterday}
          />
          <TimelineSection
            date="Nov 8, 2025"
            sessions={mockSessions.nov8}
          />
          <TimelineSection
            date="Nov 7, 2025"
            sessions={mockSessions.nov7}
          />
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-zinc-400 hover:text-zinc-300 border-zinc-800 hover:bg-zinc-800/50 h-auto px-4 py-2"
          >
            Load Earlier Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
