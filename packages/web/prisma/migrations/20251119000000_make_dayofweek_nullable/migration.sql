-- Make dayOfWeek nullable and set it to null for existing one-time events
-- This eliminates redundancy: for one-time events, dayOfWeek is derived from specificDate

-- Step 1: Make dayOfWeek column nullable
ALTER TABLE "PlannedBlock" ALTER COLUMN "dayOfWeek" DROP NOT NULL;

-- Step 2: Set dayOfWeek to NULL for all existing one-time events
-- (For one-time events, dayOfWeek will be calculated from specificDate on read)
UPDATE "PlannedBlock"
SET "dayOfWeek" = NULL
WHERE "isRecurring" = false;

-- Note: dayOfWeek remains populated for recurring events where it's the primary field
