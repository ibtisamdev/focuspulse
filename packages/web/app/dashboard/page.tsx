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
    <div>
    </div>
  )
}
