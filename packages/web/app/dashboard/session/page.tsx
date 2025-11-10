import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ActiveSessionView } from './components/ActiveSessionView'

/**
 * Session Page (Using Mock Data)
 *
 * Creates a new session with mock data
 * Server Component that passes data to client components
 */

export default async function SessionPage({
  searchParams,
}: {
  searchParams: { title?: string }
}) {
  // Ensure user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Get session title from query params or use default
  const title = searchParams.title || 'Deep Work Session'

  // Mock session data
  const sessionId = `mock-session-${Date.now()}`
  const startTime = new Date()

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
    // Mock implementation - just log
  }

  async function handleEndSession(sessionId: string, notes?: string) {
    'use server'
    console.log('Mock: End session', sessionId, notes)
    // Mock implementation - just log
  }

  return (
    <ActiveSessionView
      sessionId={sessionId}
      title={title}
      startTime={startTime}
      initialElapsedSeconds={0}
      sessionsToday={mockStats.sessionsToday}
      focusTime={mockStats.focusTime}
      target={mockStats.target}
      onUpdateSession={handleUpdateSession}
      onEndSession={handleEndSession}
    />
  )
}
