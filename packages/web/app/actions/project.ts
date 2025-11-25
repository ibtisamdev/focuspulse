'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  projectFilterSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ProjectFilterInput,
} from '@/lib/validations/project'

/**
 * Server Actions for Project Management
 *
 * These actions handle all database operations for projects
 * using Next.js Server Actions pattern (no API routes needed)
 *
 * All actions include:
 * - Input validation using Zod schemas
 * - Authentication and authorization checks
 * - Error handling with user-friendly messages
 * - Automatic cache revalidation
 */

/**
 * Create a new project
 * @param input - Project creation data
 * @returns Project object or error
 */
export async function createProject(input: CreateProjectInput) {
  try {
    // Validate input
    const validatedInput = createProjectSchema.parse(input)

    // Check authentication
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { error: 'You must be logged in to create a project' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { error: 'User account not found. Please try signing in again.' }
    }

    // Create new project
    const project = await db.project.create({
      data: {
        userId: user.id,
        name: validatedInput.name,
        description: validatedInput.description,
        color: validatedInput.color,
        icon: validatedInput.icon,
        status: validatedInput.status,
        startDate: validatedInput.startDate,
        dueDate: validatedInput.dueDate,
        isPersonal: true, // Always personal for now (single-user)
      },
    })

    // Revalidate projects page
    revalidatePath('/projects')
    revalidatePath('/dashboard')

    return { success: true, project }
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to create project. Please try again.' }
  }
}

/**
 * Get all projects for the current user
 * @param filters - Optional filters (status, search, includeArchived)
 * @returns Array of projects or error
 */
export async function getProjects(filters?: ProjectFilterInput) {
  try {
    // Validate filters if provided
    const validatedFilters = filters ? projectFilterSchema.parse(filters) : {
      status: undefined,
      search: undefined,
      includeArchived: false,
    }

    // Check authentication
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { error: 'You must be logged in to view projects' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { error: 'User account not found. Please try signing in again.' }
    }

    // Build query filters
    const where: any = {
      userId: user.id,
    }

    // Filter by status
    if (validatedFilters.status) {
      where.status = validatedFilters.status
    }

    // Exclude archived unless explicitly requested
    if (!validatedFilters.includeArchived) {
      where.status = {
        not: 'ARCHIVED',
      }
    }

    // Search by name/description
    if (validatedFilters.search) {
      where.OR = [
        { name: { contains: validatedFilters.search, mode: 'insensitive' } },
        { description: { contains: validatedFilters.search, mode: 'insensitive' } },
      ]
    }

    // Fetch projects with session count for each
    const projects = await db.project.findMany({
      where,
      include: {
        _count: {
          select: {
            sessions: true,
            plannedBlocks: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // Active first, then others
        { updatedAt: 'desc' }, // Most recently updated first
      ],
    })

    return { success: true, projects }
  } catch (error) {
    console.error('Error fetching projects:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to fetch projects. Please try again.' }
  }
}

/**
 * Get a single project by ID with detailed stats
 * @param projectId - Project ID
 * @returns Project with stats or error
 */
export async function getProjectById(projectId: string) {
  try {
    // Validate input
    const validatedId = projectIdSchema.parse(projectId)

    // Check authentication
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { error: 'You must be logged in to view projects' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { error: 'User account not found. Please try signing in again.' }
    }

    // Fetch project with sessions
    const project = await db.project.findUnique({
      where: {
        id: validatedId,
        userId: user.id, // Ensure user owns the project
      },
      include: {
        sessions: {
          orderBy: { startTime: 'desc' },
          take: 10, // Get last 10 sessions for preview
        },
        plannedBlocks: {
          where: { isActive: true },
          orderBy: { startTime: 'desc' },
        },
        _count: {
          select: {
            sessions: true,
            plannedBlocks: true,
          },
        },
      },
    })

    if (!project) {
      return { error: 'Project not found or you do not have access to it.' }
    }

    return { success: true, project }
  } catch (error) {
    console.error('Error fetching project:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to fetch project. Please try again.' }
  }
}

/**
 * Update a project
 * @param projectId - Project ID
 * @param input - Updated project data
 * @returns Updated project or error
 */
export async function updateProject(projectId: string, input: UpdateProjectInput) {
  try {
    // Validate input
    const validatedId = projectIdSchema.parse(projectId)
    const validatedInput = updateProjectSchema.parse(input)

    // Check authentication
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { error: 'You must be logged in to update projects' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { error: 'User account not found. Please try signing in again.' }
    }

    // Verify project ownership
    const existingProject = await db.project.findUnique({
      where: {
        id: validatedId,
        userId: user.id,
      },
    })

    if (!existingProject) {
      return { error: 'Project not found or you do not have permission to update it.' }
    }

    // Prepare update data
    const updateData: any = {}
    if (validatedInput.name !== undefined) updateData.name = validatedInput.name
    if (validatedInput.description !== undefined) updateData.description = validatedInput.description
    if (validatedInput.color !== undefined) updateData.color = validatedInput.color
    if (validatedInput.icon !== undefined) updateData.icon = validatedInput.icon
    if (validatedInput.status !== undefined) {
      updateData.status = validatedInput.status
      // If status is being set to COMPLETED, set completedAt
      if (validatedInput.status === 'COMPLETED' && !existingProject.completedAt) {
        updateData.completedAt = new Date()
      }
      // If status is being changed from COMPLETED, clear completedAt
      if (validatedInput.status !== 'COMPLETED' && existingProject.completedAt) {
        updateData.completedAt = null
      }
    }
    if (validatedInput.progress !== undefined) updateData.progress = validatedInput.progress
    if (validatedInput.startDate !== undefined) updateData.startDate = validatedInput.startDate
    if (validatedInput.dueDate !== undefined) updateData.dueDate = validatedInput.dueDate

    // Update project
    const project = await db.project.update({
      where: { id: validatedId },
      data: updateData,
    })

    // Revalidate projects page
    revalidatePath('/projects')
    revalidatePath(`/projects/${validatedId}`)
    revalidatePath('/dashboard')

    return { success: true, project }
  } catch (error) {
    console.error('Error updating project:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to update project. Please try again.' }
  }
}

/**
 * Delete (archive) a project
 * @param projectId - Project ID
 * @returns Success status or error
 */
export async function deleteProject(projectId: string) {
  try {
    // Validate input
    const validatedId = projectIdSchema.parse(projectId)

    // Check authentication
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { error: 'You must be logged in to delete projects' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { error: 'User account not found. Please try signing in again.' }
    }

    // Verify project ownership
    const existingProject = await db.project.findUnique({
      where: {
        id: validatedId,
        userId: user.id,
      },
    })

    if (!existingProject) {
      return { error: 'Project not found or you do not have permission to delete it.' }
    }

    // Soft delete: Archive the project instead of hard delete
    await db.project.update({
      where: { id: validatedId },
      data: { status: 'ARCHIVED' },
    })

    // Revalidate projects page
    revalidatePath('/projects')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting project:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to delete project. Please try again.' }
  }
}

/**
 * Get project statistics (time tracking)
 * @param projectId - Project ID
 * @returns Project stats or error
 */
export async function getProjectStats(projectId: string) {
  try {
    // Validate input
    const validatedId = projectIdSchema.parse(projectId)

    // Check authentication
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { error: 'You must be logged in to view project stats' }
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return { error: 'User account not found. Please try signing in again.' }
    }

    // Verify project ownership and fetch sessions
    const project = await db.project.findUnique({
      where: {
        id: validatedId,
        userId: user.id,
      },
      include: {
        sessions: {
          where: { completed: true },
          select: {
            startTime: true,
            endTime: true,
            totalBreakTime: true,
            focusScore: true,
          },
        },
      },
    })

    if (!project) {
      return { error: 'Project not found or you do not have access to it.' }
    }

    // Calculate statistics
    let totalMinutes = 0
    let totalSessions = project.sessions.length
    let totalFocusScore = 0
    let focusScoreCount = 0

    project.sessions.forEach((session) => {
      if (session.endTime) {
        const durationMs = session.endTime.getTime() - session.startTime.getTime()
        const durationMinutes = Math.floor(durationMs / 60000) - (session.totalBreakTime || 0)
        totalMinutes += durationMinutes
      }

      if (session.focusScore !== null) {
        totalFocusScore += session.focusScore
        focusScoreCount++
      }
    })

    const stats = {
      totalSessions,
      totalMinutes,
      totalHours: Math.floor(totalMinutes / 60),
      averageFocusScore: focusScoreCount > 0 ? Math.round(totalFocusScore / focusScoreCount) : null,
      lastSessionDate: project.sessions[0]?.startTime || null,
    }

    return { success: true, stats }
  } catch (error) {
    console.error('Error fetching project stats:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to fetch project stats. Please try again.' }
  }
}
