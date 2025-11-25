-- Comprehensive Planner Schema Redesign Migration
-- This migration transforms the planner schema with enums, enhanced features, and better type safety

-- Step 1: Create Enums
CREATE TYPE "BlockCategory" AS ENUM ('WORK', 'STUDY', 'PERSONAL', 'EXERCISE', 'BREAK', 'OTHER');
CREATE TYPE "RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- Step 2: Add new columns to PlannedBlock with defaults
ALTER TABLE "PlannedBlock" ADD COLUMN "description" TEXT;
ALTER TABLE "PlannedBlock" ADD COLUMN "category" "BlockCategory" NOT NULL DEFAULT 'OTHER';
ALTER TABLE "PlannedBlock" ADD COLUMN "color" TEXT;
ALTER TABLE "PlannedBlock" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "PlannedBlock" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "PlannedBlock" ADD COLUMN "specificDate" TIMESTAMP(3);
ALTER TABLE "PlannedBlock" ADD COLUMN "recurrenceFrequency" "RecurrenceFrequency";
ALTER TABLE "PlannedBlock" ADD COLUMN "recurrenceDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
ALTER TABLE "PlannedBlock" ADD COLUMN "recurrenceEndDate" TIMESTAMP(3);
ALTER TABLE "PlannedBlock" ADD COLUMN "reminderMinutes" INTEGER;

-- Step 3: Add temporary column for new DateTime startTime
ALTER TABLE "PlannedBlock" ADD COLUMN "startTime_new" TIMESTAMP(3);

-- Step 4: Convert existing startTime (String "HH:MM") to DateTime
-- For recurring events: use epoch date (1970-01-01) + time
-- For one-time events with specificDate: use specificDate + time
-- For one-time events without specificDate: use current date + time (fallback)

UPDATE "PlannedBlock"
SET "startTime_new" = CASE
  -- For recurring events, use epoch date with the time
  WHEN "isRecurring" = true THEN
    ('1970-01-01 ' || "startTime" || ':00')::TIMESTAMP
  -- For non-recurring with specificDate, combine specificDate's date with startTime
  WHEN "isRecurring" = false AND "specificDate" IS NOT NULL THEN
    (DATE("specificDate") || ' ' || "startTime" || ':00')::TIMESTAMP
  -- Fallback: use current date + time (shouldn't happen if data is clean)
  ELSE
    (CURRENT_DATE || ' ' || "startTime" || ':00')::TIMESTAMP
END;

-- Step 5: Drop old startTime column and rename new one
ALTER TABLE "PlannedBlock" DROP COLUMN "startTime";
ALTER TABLE "PlannedBlock" RENAME COLUMN "startTime_new" TO "startTime";

-- Step 6: Make startTime NOT NULL (after data migration)
ALTER TABLE "PlannedBlock" ALTER COLUMN "startTime" SET NOT NULL;

-- Step 7: Add new columns to Session
ALTER TABLE "Session" ADD COLUMN "plannedBlockId" TEXT;
ALTER TABLE "Session" ADD COLUMN "category" "BlockCategory" NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Session" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Session" ADD COLUMN "focusScore" INTEGER;

-- Step 8: Remove deprecated columns from Session
ALTER TABLE "Session" DROP COLUMN "duration";
ALTER TABLE "Session" DROP COLUMN "isPlanned";

-- Step 9: Add foreign key constraint for Session -> PlannedBlock
ALTER TABLE "Session" ADD CONSTRAINT "Session_plannedBlockId_fkey"
  FOREIGN KEY ("plannedBlockId") REFERENCES "PlannedBlock"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 10: Create new indexes

-- PlannedBlock indexes
CREATE INDEX "PlannedBlock_userId_category_idx" ON "PlannedBlock"("userId", "category");
CREATE INDEX "PlannedBlock_specificDate_idx" ON "PlannedBlock"("specificDate");
CREATE INDEX "PlannedBlock_isRecurring_idx" ON "PlannedBlock"("isRecurring");

-- Session indexes
CREATE INDEX "Session_plannedBlockId_idx" ON "Session"("plannedBlockId");
CREATE INDEX "Session_userId_category_idx" ON "Session"("userId", "category");

-- Step 11: Update any default values to match new schema
-- (All new columns already have appropriate defaults set above)

-- Migration complete!
-- Note: After running this migration:
-- 1. Run `npx prisma generate` to update Prisma Client
-- 2. Update application code to handle new schema
-- 3. Test thoroughly before deploying to production
