import { z } from 'zod'

// Validation schemas for planner
const timeFormatRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/

export const plannedBlockSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timeFormatRegex, 'Invalid time format (use HH:MM)'),
  duration: z.number().int().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  isRecurring: z.boolean().default(false),
})

export const updatePlannedBlockSchema = plannedBlockSchema.extend({
  id: z.string(),
  isActive: z.boolean().optional(),
})

export type PlannedBlockInput = z.infer<typeof plannedBlockSchema>
export type UpdatePlannedBlockInput = z.infer<typeof updatePlannedBlockSchema>
