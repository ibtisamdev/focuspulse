import { z } from 'zod'
import { BlockCategory, RecurrenceFrequency } from '@prisma/client'

// Enums for validation
export const BlockCategoryEnum = z.nativeEnum(BlockCategory)
export const RecurrenceFrequencyEnum = z.nativeEnum(RecurrenceFrequency)

// Helper validation for hex colors
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

// Validation schema for planned blocks
export const plannedBlockSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().max(500, 'Description too long').optional(),

    // Time - now accepts DateTime
    startTime: z.coerce.date(),
    duration: z.number().int().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),

    // Categorization
    category: BlockCategoryEnum.default(BlockCategory.OTHER),
    color: z.string().regex(hexColorRegex, 'Invalid color format (use #RGB or #RRGGBB)').optional(),
    priority: z.number().int().min(0).max(10).default(0),
    tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags').default([]),

    // Recurrence settings
    isRecurring: z.boolean().default(false),
    recurrenceFrequency: RecurrenceFrequencyEnum.optional(),
    recurrenceDays: z.array(z.number().int().min(0).max(6)).max(7).default([]),
    recurrenceEndDate: z.coerce.date().optional(),

    // One-time event specific
    specificDate: z.coerce.date().optional(),

    // Day of week (0-6, Monday=0) - DEPRECATED: Being removed in favor of encoding day in startTime
    // Optional during transition period. Will be calculated from startTime.
    dayOfWeek: z.number().int().min(0).max(6).optional(),

    // Reminders
    reminderMinutes: z.number().int().min(0).max(1440).optional(),

    // Status
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // If not recurring, specificDate must be provided
      if (!data.isRecurring && !data.specificDate) {
        return false
      }
      return true
    },
    {
      message: 'Specific date is required for non-recurring events',
      path: ['specificDate'],
    }
  )
  .refine(
    (data) => {
      // If recurring, recurrenceFrequency must be provided
      if (data.isRecurring && !data.recurrenceFrequency) {
        return false
      }
      return true
    },
    {
      message: 'Recurrence frequency is required for recurring events',
      path: ['recurrenceFrequency'],
    }
  )
  .refine(
    (data) => {
      // If weekly recurrence, recurrenceDays must have at least one day
      if (data.isRecurring && data.recurrenceFrequency === RecurrenceFrequency.WEEKLY && data.recurrenceDays.length === 0) {
        return false
      }
      return true
    },
    {
      message: 'At least one day must be selected for weekly recurrence',
      path: ['recurrenceDays'],
    }
  )

export const updatePlannedBlockSchema = plannedBlockSchema.merge(
  z.object({
    id: z.string().cuid(),
  })
)

// Validation schema for sessions
export const sessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  startTime: z.coerce.date().default(() => new Date()),
  endTime: z.coerce.date().optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),

  // Planning relationship
  plannedBlockId: z.string().cuid().optional(),

  // Categorization
  category: BlockCategoryEnum.default(BlockCategory.OTHER),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags').default([]),

  // Status
  completed: z.boolean().default(false),
  isPaused: z.boolean().default(false),
  pausedAt: z.coerce.date().optional(),

  // Break tracking
  breakCount: z.number().int().min(0).default(0),
  totalBreakTime: z.number().int().min(0).default(0),

  // Productivity metrics
  focusScore: z.number().int().min(0).max(100).optional(),
})

export const updateSessionSchema = sessionSchema.extend({
  id: z.string().cuid(),
})

// Type exports
export type PlannedBlockInput = z.infer<typeof plannedBlockSchema>
export type UpdatePlannedBlockInput = z.infer<typeof updatePlannedBlockSchema>
export type SessionInput = z.infer<typeof sessionSchema>
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>
