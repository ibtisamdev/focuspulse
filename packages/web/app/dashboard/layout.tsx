import { DashboardHeader } from './components/DashboardHeader'
import { DashboardFooter } from './components/DashboardFooter'
import { getActiveSession } from '@/app/actions/session'

/**
 * Dashboard Layout
 *
 * Provides persistent header and footer for all dashboard pages.
 * This layout wraps all pages under /dashboard route.
 */

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch active session to determine header state
  const activeSession = await getActiveSession()

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Top Navigation */}
      <DashboardHeader hasActiveSession={!!activeSession} />

      {/* Main Content - Page-specific content will be rendered here */}
      {children}

      {/* Footer */}
      <DashboardFooter />
    </div>
  )
}
