import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUser, getCurrentUser } from '@/app/actions/user'
import { getActiveSession, getUserStats } from '@/app/actions/session'
import { getHistoryStats, getWeeklyData, getSessionsHistory } from '@/app/actions/history'
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

  // Get user from database
  const currentUserResult = await getCurrentUser()
  const currentUser = currentUserResult.user

  // Redirect if user not found
  if (!currentUser) {
    redirect('/sign-in')
  }

  // Fetch all data in parallel for better performance
  const [activeSession, todayStats, historyStats, weeklyData, recentSessions] = await Promise.all([
    getActiveSession(),
    getUserStats(),
    getHistoryStats(),
    getWeeklyData(0), // Current week
    getSessionsHistory({ limit: 5 }),
  ])

  // Transform recent sessions data for the component
  const transformedSessions = Object.values(recentSessions.groupedSessions)
    .flat()
    .slice(0, 5)
    .map((session: any) => ({
      id: session.id,
      title: session.title,
      duration: session.duration,
      startTime: session.startTime,
      isPlanned: session.isPlanned,
    }))

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
        <StatsCards
          focusTime={todayStats.focusTime}
          sessionsToday={todayStats.sessionsToday}
          streak={historyStats.streak}
          target={todayStats.target}
        />
      </div>

      {/* Activity Card */}
      <div className="mb-8">
        <WeeklyActivity
          weeklyData={weeklyData}
          weeklyGoalHours={currentUser.weeklyGoalHours}
        />
      </div>

      {/* Recent Sessions */}
      <div className="mb-8">
        <RecentTasks />
      </div>

      {/* Quick Actions */}
      {/* <QuickActions /> */}
    </main>
  )
}
