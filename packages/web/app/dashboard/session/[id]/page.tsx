import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ActiveSessionView } from '../components/ActiveSessionView'

/**
 * Dynamic Session Page (Using Mock Data)
 *
 * Resume an existing session by ID with mock data
 */

export default async function SessionByIdPage({
  params,
}: {
  params: { id: string }
}) {
  // Ensure user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Mock session data
  const title = 'Deep Work Session'
  const startTime = new Date(Date.now() - 25 * 60 * 1000) // Started 25 minutes ago
  const elapsedSeconds = 25 * 60 // 25 minutes

  // Mock stats
  const mockStats = {
    sessionsToday: 3,
    focusTime: '2h 14m',
    target: '4h',
  }

  // Server action wrappers for client component (mock implementations)
  async function handleUpdateSession(sessionId: string, data: { isPaused: boolean; pausedAt?: Date }) {
    'use server'
    console.log('Mock: Update session', sessionId, data)
  }

  async function handleEndSession(sessionId: string, notes?: string) {
    'use server'
    console.log('Mock: End session', sessionId, notes)
  }

  return (
    <ActiveSessionView
      sessionId={params.id}
      title={title}
      startTime={startTime}
      initialElapsedSeconds={elapsedSeconds}
      sessionsToday={mockStats.sessionsToday}
      focusTime={mockStats.focusTime}
      target={mockStats.target}
      onUpdateSession={handleUpdateSession}
      onEndSession={handleEndSession}
    />
  )
}
