import { DashboardHeader } from '../dashboard/components/DashboardHeader'
import { DashboardFooter } from '../dashboard/components/DashboardFooter'

/**
 * Projects Layout
 *
 * Provides persistent header and footer for all projects pages.
 * Uses the same header and footer as the dashboard for consistency.
 */

export default function ProjectsLayout({
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
