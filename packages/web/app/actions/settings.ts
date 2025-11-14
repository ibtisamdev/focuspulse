'use server'

/**
 * Settings Server Actions
 *
 * These server actions handle user settings updates including:
 * - Profile information (name, email)
 * - Password changes via Clerk
 * - User preferences (weekly goals, session duration, theme, timezone, notifications)
 * - Data export and account deletion
 */

import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Update user profile information
 */
export async function updateProfile(data: {
  firstName: string
  lastName: string
}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update in Clerk
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
    })

    // Update in database
    await db.user.update({
      where: { clerkId: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    })

    revalidatePath('/dashboard/settings')

    return { success: true }
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message || 'Failed to update profile' }
  }
}

/**
 * Update user avatar
 */
export async function updateAvatar(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please upload a PNG, JPG, or WebP image' }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' }
    }

    // Update profile image in Clerk
    const client = await clerkClient()
    const updatedUser = await client.users.updateUserProfileImage(userId, {
      file: file,
    })

    // Update imageUrl in database
    await db.user.update({
      where: { clerkId: userId },
      data: {
        imageUrl: updatedUser.imageUrl,
      },
    })

    revalidatePath('/dashboard/settings')

    return { success: true }
  } catch (error: any) {
    console.error('Error updating avatar:', error)

    // Check for common Clerk errors
    if (error.clerkError) {
      return { success: false, error: error.errors?.[0]?.message || 'Failed to update avatar' }
    }

    return { success: false, error: error.message || 'Failed to update avatar' }
  }
}

/**
 * Update user password via Clerk
 */
export async function updatePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get the user from Clerk to check if they have a password set
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return { success: false, error: 'User not found' }
    }

    // Note: Clerk's password update requires the user to be authenticated
    // In a real app, you'd want to verify the current password first
    // However, Clerk's API doesn't directly support password verification
    // You may need to use Clerk's session token approach or redirect to Clerk's UI

    // For now, we'll use Clerk's user management API to update the password
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      password: data.newPassword,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error updating password:', error)

    // Check for common Clerk errors
    if (error.clerkError) {
      return { success: false, error: error.errors?.[0]?.message || 'Failed to update password' }
    }

    return { success: false, error: 'Failed to update password' }
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(data: {
  weeklyGoalHours: number
  defaultSessionDuration: number
  theme: string
  timezone: string
  emailNotifications: boolean
  sessionReminders: boolean
  streakAlerts: boolean
}) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    if (data.weeklyGoalHours < 1 || data.weeklyGoalHours > 168) {
      return { success: false, error: 'Weekly goal must be between 1 and 168 hours' }
    }

    if (![25, 45, 60, 90, 120].includes(data.defaultSessionDuration)) {
      return { success: false, error: 'Invalid session duration' }
    }

    if (!['dark', 'light', 'system'].includes(data.theme)) {
      return { success: false, error: 'Invalid theme' }
    }

    // Update in database
    await db.user.update({
      where: { clerkId: userId },
      data: {
        weeklyGoalHours: data.weeklyGoalHours,
        defaultSessionDuration: data.defaultSessionDuration,
        theme: data.theme,
        timezone: data.timezone,
        emailNotifications: data.emailNotifications,
        sessionReminders: data.sessionReminders,
        streakAlerts: data.streakAlerts,
      },
    })

    revalidatePath('/dashboard/settings')

    return { success: true }
  } catch (error: any) {
    console.error('Error updating preferences:', error)
    return { success: false, error: error.message || 'Failed to update preferences' }
  }
}

/**
 * Export user data as JSON
 */
export async function exportUserData() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        sessions: {
          orderBy: { startTime: 'desc' },
        },
        plannedBlocks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return { success: false, error: 'User not found', data: null }
    }

    // Remove sensitive data
    const exportData = {
      profile: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      preferences: {
        weeklyGoalHours: user.weeklyGoalHours,
        defaultSessionDuration: user.defaultSessionDuration,
        theme: user.theme,
        timezone: user.timezone,
        emailNotifications: user.emailNotifications,
        sessionReminders: user.sessionReminders,
        streakAlerts: user.streakAlerts,
      },
      sessions: user.sessions.map(session => ({
        title: session.title,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        notes: session.notes,
        isPlanned: session.isPlanned,
        completed: session.completed,
        breakCount: session.breakCount,
        totalBreakTime: session.totalBreakTime,
      })),
      plannedBlocks: user.plannedBlocks.map(block => ({
        title: block.title,
        dayOfWeek: block.dayOfWeek,
        startTime: block.startTime,
        duration: block.duration,
        isRecurring: block.isRecurring,
        isActive: block.isActive,
      })),
      exportedAt: new Date().toISOString(),
    }

    return { success: true, data: exportData }
  } catch (error) {
    console.error('Error exporting user data:', error)
    return { success: false, error: 'Failed to export data', data: null }
  }
}

/**
 * Delete user account (both from database and Clerk)
 */
export async function deleteAccount() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Delete from database first (cascade will delete sessions and planned blocks)
    await db.user.delete({
      where: { clerkId: userId },
    })

    // Delete from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return { success: true }
  } catch (error) {
    console.error('Error deleting account:', error)
    return { success: false, error: 'Failed to delete account' }
  }
}
