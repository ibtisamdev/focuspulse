import { HistoryStatsCards } from './components/HistoryStatsCards'
import { WeeklyOverview } from './components/WeeklyOverview'
import { SessionTimeline } from './components/SessionTimeline'
import { InsightCards } from './components/InsightCards'

/**
 * Session History & Stats Page
 *
 * Displays comprehensive session history with timeline view,
 * statistics, weekly overview, and insights.
 */
export default function HistoryPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-50 mb-2">
          Session History & Stats
        </h1>
        <p className="text-sm text-zinc-400">
          Review your past sessions and productivity insights
        </p>
      </div>

      {/* Stats Cards Grid */}
      <HistoryStatsCards />

      {/* Weekly Overview Chart */}
      <WeeklyOverview />

      {/* Session Timeline */}
      <SessionTimeline />

      {/* Insights Cards */}
      <InsightCards />
    </main>
  )
}
