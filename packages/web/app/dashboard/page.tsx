import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { syncUser, getCurrentUser } from '@/app/actions/user'

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

  // Get user info from Clerk
  const clerkUser = await currentUser()

  // Sync user to database (creates or updates)
  await syncUser()

  // Get user from database
  const { user: dbUser } = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">FocusPulse</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome back, {clerkUser?.firstName || 'User'}!
          </h2>
          <p className="text-muted-foreground mt-2">
            Here's your productivity dashboard
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Profile</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="font-medium">
                  {clerkUser?.firstName} {clerkUser?.lastName}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium">
                  {clerkUser?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              {dbUser && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Database ID:
                  </span>
                  <p className="font-mono text-xs">{dbUser.id}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <p className="text-sm text-muted-foreground">
              Your productivity metrics will appear here once you start using
              FocusPulse.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">
              Your recent focus sessions will be displayed here.
            </p>
          </div>
        </div>

        {/* Setup Status */}
        <div className="mt-8 rounded-lg border bg-green-50 dark:bg-green-950 p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            Setup Complete!
          </h3>
          <p className="text-sm text-green-800 dark:text-green-200">
            Your Neon database and Clerk authentication are now configured and
            working properly. You can start building your FocusPulse features!
          </p>
        </div>
      </main>
    </div>
  )
}
