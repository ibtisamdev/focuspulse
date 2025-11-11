import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUser, getCurrentUser } from '@/app/actions/user'
import { getActiveSession } from '@/app/actions/session'
import { StatsCards } from './components/StatsCards'
import { WeeklyActivity } from './components/WeeklyActivity'
import { RecentTasks } from './components/RecentTasks'
import { QuickActions } from './components/QuickActions'
import { ActiveSessionBanner } from './components/ActiveSessionBanner'
import { StartSessionCTA } from './components/StartSessionCTA'

/**
 * Dashboard Page (Protected Route)
 *
 * This page is protected by Clerk middleware.
 * Users must be authenticated to access it.
 */

export default async function DashboardPage() {
  // Ensure user is authenticated (middleware handles this, but double-check)
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Sync user to database (creates or updates)
  await syncUser()

  // Get user from database (available for future use)
  await getCurrentUser()

  // Check for active session
  const activeSession = await getActiveSession()

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-50 mb-2">Dashboard</h1>
        <p className="text-sm text-zinc-400">Track your productivity and focus metrics</p>
      </div>

      {/* Active Session Banner */}
      {activeSession && (
        <ActiveSessionBanner
          sessionId={activeSession.id}
          title={activeSession.title}
          startTime={activeSession.startTime}
        />
      )}

      {/* Hero CTA - Start Deep Work (Only show if no active session) */}
      {!activeSession && <StartSessionCTA />}

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards />
      </div>

      {/* Activity Card */}
      <div className="mb-8">
        <WeeklyActivity />
      </div>

      {/* Recent Tasks */}
      <div className="mb-8">
        <RecentTasks />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </main>
  )
}
