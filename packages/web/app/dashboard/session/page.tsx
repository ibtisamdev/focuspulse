import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ActiveSessionView } from './components/ActiveSessionView'
import { createSession, updateSession, endSession, getUserStats, getActiveSession } from '@/app/actions/session'

/**
 * Session Page
 *
 * Creates a new session or redirects to active session if one exists
 * Server Component that passes data to client components
 */

export default async function SessionPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string }>
}) {
  // Ensure user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user already has an active session
  const activeSession = await getActiveSession()
  if (activeSession) {
    // Redirect to existing active session instead of creating a new one
    redirect(`/dashboard/session/${activeSession.id}`)
  }

  // Await searchParams (Next.js 15+ requirement)
  const { title: titleParam } = await searchParams

  // Get session title from query params or use default
  const title = titleParam || 'Deep Work Session'

  // Create new session in database
  const sessionResult = await createSession(title, false)

  // Handle error case
  if ('error' in sessionResult) {
    // Redirect to dashboard with error (in production, you'd show a toast/notification)
    redirect('/dashboard?error=failed-to-create-session')
  }

  // Get user stats
  const stats = await getUserStats()

  // Server action wrappers for client component
  async function handleUpdateSession(sessionId: string, data: { isPaused: boolean; pausedAt?: Date }) {
    'use server'
    await updateSession(sessionId, data)
  }

  async function handleEndSession(sessionId: string, notes?: string) {
    'use server'
    await endSession(sessionId, notes)
  }

  return (
    <ActiveSessionView
      sessionId={sessionResult.data.id}
      title={title}
      startTime={sessionResult.data.startTime}
      initialElapsedSeconds={0}
      sessionsToday={stats.sessionsToday}
      focusTime={stats.focusTime}
      target={stats.target}
      onUpdateSession={handleUpdateSession}
      onEndSession={handleEndSession}
    />
  )
}
