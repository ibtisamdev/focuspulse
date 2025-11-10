import { DashboardHeader } from './components/DashboardHeader'
import { DashboardFooter } from './components/DashboardFooter'

/**
 * Dashboard Layout
 *
 * Provides persistent header and footer for all dashboard pages.
 * This layout wraps all pages under /dashboard route.
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Top Navigation */}
      <DashboardHeader />

      {/* Main Content - Page-specific content will be rendered here */}
      {children}

      {/* Footer */}
      <DashboardFooter />
    </div>
  )
}
