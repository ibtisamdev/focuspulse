import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUser, getCurrentUser } from '@/app/actions/user'
import { StatsCards } from './components/StatsCards'
import { WeeklyActivity } from './components/WeeklyActivity'
import { RecentTasks } from './components/RecentTasks'
import { QuickActions } from './components/QuickActions'

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

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-50 mb-2">Dashboard</h1>
        <p className="text-sm text-zinc-400">Track your productivity and focus metrics</p>
      </div>

      {/* Hero CTA - Start Deep Work */}
      <div className="mb-8">
        <a
          href="/dashboard/session"
          className="block bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-zinc-700 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-900"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-zinc-50">Start Deep Work Now</h2>
              </div>
              <p className="text-sm text-zinc-400">
                Begin a focused work session and track your progress
              </p>
            </div>
            <div className="hidden md:block">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </a>
      </div>

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
