'use server'

/**
 * User Server Actions
 *
 * These server actions handle user-related database operations.
 * They use Clerk for authentication and Prisma for database access.
 */

import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

/**
 * Sync user from Clerk to the database
 * This should be called after a user signs up or signs in
 */
export async function syncUser() {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new Error('User not found')
    }

    // Check if user already exists in database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      // Update existing user
      await db.user.update({
        where: { clerkId: userId },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        },
      })
    } else {
      // Create new user
      await db.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error syncing user:', error)
    return { success: false, error: 'Failed to sync user' }
  }
}

/**
 * Get the current user from the database
 */
export async function getCurrentUser() {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    return { success: true, user }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { success: false, error: 'Failed to get user', user: null }
  }
}
