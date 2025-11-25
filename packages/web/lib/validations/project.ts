import { z } from 'zod'

/**
 * Validation Schemas for Project Actions
 *
 * These schemas validate input data for project-related server actions
 * to prevent invalid data from reaching the database.
 */

/**
 * Enum schemas matching Prisma enums
 */
export const projectStatusSchema = z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'])

export type ProjectStatus = z.infer<typeof projectStatusSchema>

/**
 * Schema for creating a new project
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #3b82f6)')
    .optional(),
  icon: z
    .string()
    .max(50, 'Icon identifier must be less than 50 characters')
    .optional(),
  status: projectStatusSchema.default('ACTIVE'),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
})
  .refine(
    (data) => {
      // Ensure dueDate is after startDate if both are provided
      if (data.startDate && data.dueDate) {
        return data.dueDate >= data.startDate
      }
      return true
    },
    {
      message: 'Due date must be after start date',
      path: ['dueDate'],
    }
  )

export type CreateProjectInput = z.infer<typeof createProjectSchema>

/**
 * Schema for updating a project
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #3b82f6)')
    .optional()
    .nullable(),
  icon: z
    .string()
    .max(50, 'Icon identifier must be less than 50 characters')
    .optional()
    .nullable(),
  status: projectStatusSchema.optional(),
  progress: z
    .number()
    .min(0, 'Progress must be at least 0')
    .max(100, 'Progress cannot exceed 100')
    .optional(),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
})

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

/**
 * Schema for project ID validation
 */
export const projectIdSchema = z.string().cuid('Invalid project ID')

/**
 * Schema for project filter options
 */
export const projectFilterSchema = z.object({
  status: projectStatusSchema.optional(),
  search: z.string().trim().optional(),
  includeArchived: z.boolean().optional().default(false),
})

export type ProjectFilterInput = Partial<z.infer<typeof projectFilterSchema>>
