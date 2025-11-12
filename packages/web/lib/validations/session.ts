import { z } from 'zod'

/**
 * Validation Schemas for Session Actions
 *
 * These schemas validate input data for session-related server actions
 * to prevent invalid data from reaching the database.
 */

/**
 * Schema for creating a new session
 */
export const createSessionSchema = z.object({
  title: z
    .string()
    .min(1, 'Session title is required')
    .max(200, 'Session title must be less than 200 characters')
    .trim(),
  isPlanned: z.boolean().optional().default(false),
})

export type CreateSessionInput = z.infer<typeof createSessionSchema>

/**
 * Schema for updating session state (pause/resume)
 */
export const updateSessionSchema = z.object({
  isPaused: z.boolean().optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .trim()
    .optional(),
})

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>

/**
 * Schema for ending a session
 */
export const endSessionSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID'),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .trim()
    .optional(),
})

export type EndSessionInput = z.infer<typeof endSessionSchema>

/**
 * Schema for session ID validation
 */
export const sessionIdSchema = z.string().cuid('Invalid session ID')
