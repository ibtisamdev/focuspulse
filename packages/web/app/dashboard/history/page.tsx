import { HistoryStatsCards } from './components/HistoryStatsCards'
import { WeeklyOverview } from './components/WeeklyOverview'
import { SessionTimeline } from './components/SessionTimeline'
import { InsightCards } from './components/InsightCards'
import { getHistoryStats, getWeeklyData, getSessionsHistory, getInsights } from '@/app/actions/history'

/**
 * Session History & Stats Page
 *
 * Displays comprehensive session history with timeline view,
 * statistics, weekly overview, and insights.
 */
export default async function HistoryPage() {
  // Fetch all data in parallel for better performance
  const [stats, thisWeekData, lastWeekData, sessionsData, insights] = await Promise.all([
    getHistoryStats(),
    getWeeklyData(0), // Current week
    getWeeklyData(-1), // Last week
    getSessionsHistory({ limit: 20 }),
    getInsights(),
  ])

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
      <HistoryStatsCards
        totalHours={stats.totalHours}
        streak={stats.streak}
        sessionCount={stats.sessionCount}
        avgLength={stats.avgLength}
      />

      {/* Weekly Overview Chart */}
      <WeeklyOverview thisWeekData={thisWeekData} lastWeekData={lastWeekData} />

      {/* Session Timeline */}
      <SessionTimeline
        initialSessions={sessionsData.groupedSessions}
        totalCount={sessionsData.totalCount}
        hasMore={sessionsData.hasMore}
      />

      {/* Insights Cards */}
      <InsightCards
        bestDay={insights.bestDay}
        peakHours={insights.peakHours}
        completionRate={insights.completionRate}
      />
    </main>
  )
}
