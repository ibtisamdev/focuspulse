-- Migration: Remove dayOfWeek field and encode day in startTime for recurring events
-- This changes from Sunday-based (0=Sunday) to Monday-based weeks (0=Monday in our system)
-- Reference week: 2024-01-01 (Monday) through 2024-01-07 (Sunday)

-- Step 1: Update startTime for all recurring events to encode day of week
-- For recurring events, set startTime to a date in the reference week that matches the day
-- This preserves the time component while encoding the day of week in the date component
UPDATE "PlannedBlock"
SET "startTime" = (
  CASE "dayOfWeek"
    WHEN 0 THEN '2024-01-07'::date + "startTime"::time  -- Old: Sunday (0) → New: 2024-01-07 (Sunday)
    WHEN 1 THEN '2024-01-01'::date + "startTime"::time  -- Old: Monday (1) → New: 2024-01-01 (Monday)
    WHEN 2 THEN '2024-01-02'::date + "startTime"::time  -- Old: Tuesday (2) → New: 2024-01-02 (Tuesday)
    WHEN 3 THEN '2024-01-03'::date + "startTime"::time  -- Old: Wednesday (3) → New: 2024-01-03 (Wednesday)
    WHEN 4 THEN '2024-01-04'::date + "startTime"::time  -- Old: Thursday (4) → New: 2024-01-04 (Thursday)
    WHEN 5 THEN '2024-01-05'::date + "startTime"::time  -- Old: Friday (5) → New: 2024-01-05 (Friday)
    WHEN 6 THEN '2024-01-06'::date + "startTime"::time  -- Old: Saturday (6) → New: 2024-01-06 (Saturday)
    ELSE "startTime"  -- Fallback: keep existing startTime if dayOfWeek is NULL
  END
)
WHERE "isRecurring" = true AND "dayOfWeek" IS NOT NULL;

-- Step 2: Drop the index on (userId, dayOfWeek)
DROP INDEX IF EXISTS "PlannedBlock_userId_dayOfWeek_idx";

-- Step 3: Drop the dayOfWeek column
ALTER TABLE "PlannedBlock" DROP COLUMN IF EXISTS "dayOfWeek";

-- Step 4: Add comment to startTime column documenting the encoding
COMMENT ON COLUMN "PlannedBlock"."startTime" IS 'DateTime field. For recurring events: date encodes day of week (2024-01-01=Monday through 2024-01-07=Sunday), time is the scheduled time. For one-time events: full date and time of the event.';

-- Optional Step 5: Create expression index for performance (PostgreSQL 12+)
-- This allows efficient queries by day of week while keeping the data normalized
-- Note: EXTRACT(DOW FROM date) returns 0=Sunday, 1=Monday, so we adjust to Monday-based
CREATE INDEX IF NOT EXISTS "PlannedBlock_userId_dow_calc_idx"
  ON "PlannedBlock" ("userId", ((EXTRACT(DOW FROM "startTime")::integer + 6) % 7))
  WHERE "isRecurring" = true;
