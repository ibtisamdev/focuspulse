-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "weeklyGoalHours" INTEGER NOT NULL DEFAULT 12,
    "defaultSessionDuration" INTEGER NOT NULL DEFAULT 90,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "notes" TEXT,
    "isPlanned" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "pausedAt" TIMESTAMP(3),
    "breakCount" INTEGER NOT NULL DEFAULT 0,
    "totalBreakTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedBlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_startTime_idx" ON "Session"("startTime");

-- CreateIndex
CREATE INDEX "Session_completed_idx" ON "Session"("completed");

-- CreateIndex
CREATE INDEX "Session_userId_startTime_idx" ON "Session"("userId", "startTime");

-- CreateIndex
CREATE INDEX "PlannedBlock_userId_idx" ON "PlannedBlock"("userId");

-- CreateIndex
CREATE INDEX "PlannedBlock_userId_dayOfWeek_idx" ON "PlannedBlock"("userId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "PlannedBlock_isActive_idx" ON "PlannedBlock"("isActive");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBlock" ADD CONSTRAINT "PlannedBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
