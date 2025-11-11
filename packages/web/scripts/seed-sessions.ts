/**
 * Seed Script: Mock Session Data
 *
 * This script creates mock session data for testing the History page.
 *
 * Usage:
 *   bun run scripts/seed-sessions.ts <your-email@example.com>
 *   or
 *   cd packages/web && bun run seed:sessions <your-email@example.com>
 */

// Load environment variables
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env file from the web package directory
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env')
console.log(`Loading .env from: ${envPath}`)
const result = config({ path: envPath })
if (result.error) {
  console.error('Error loading .env:', result.error)
} else {
  console.log(`✓ Loaded ${Object.keys(result.parsed || {}).length} environment variables`)
}

import { db } from '../lib/db'

// Mock session data configurations
const sessionTitles = [
  'Deep Work: Feature Development',
  'Code Review Session',
  'Bug Fixing Sprint',
  'Documentation Writing',
  'UI Design & Prototyping',
  'Database Optimization',
  'API Integration',
  'Testing & QA',
  'Research & Planning',
  'Team Sync Meeting',
  'Client Presentation Prep',
  'Refactoring Legacy Code',
  'Security Audit',
  'Performance Analysis',
  'Writing Unit Tests',
]

const sessionNotes = [
  'Made significant progress on the main feature. Implemented authentication flow and tested edge cases.',
  'Reviewed 3 pull requests and provided detailed feedback. Found several potential issues.',
  'Fixed critical bug affecting user registration. Deployed hotfix to production.',
  'Updated API documentation with new endpoints. Added code examples and usage guidelines.',
  'Completed initial mockups for dashboard redesign. Got positive feedback from team.',
  null, // Some sessions have no notes
  'Optimized slow queries. Reduced average response time by 40%.',
  'Wrote comprehensive test suite for payment module. Coverage increased to 85%.',
  'Researched different state management solutions. Narrowed down to two options.',
  null,
  'Productive meeting with stakeholders. Aligned on Q1 priorities.',
  'Refactored authentication module. Code is much cleaner now.',
  null,
  'Identified and fixed 3 security vulnerabilities in the payment flow.',
  'Added unit tests for critical business logic. All tests passing.',
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDuration(): number {
  // Duration in seconds: 30min to 3 hours
  const durations = [
    30 * 60,  // 30 min
    45 * 60,  // 45 min
    60 * 60,  // 1 hour
    75 * 60,  // 1h 15m
    90 * 60,  // 1h 30m
    105 * 60, // 1h 45m
    120 * 60, // 2 hours
    135 * 60, // 2h 15m
    150 * 60, // 2h 30m
    180 * 60, // 3 hours
  ]
  return getRandomElement(durations)
}

function getRandomBreakTime(duration: number): number {
  // Break time is 0-15% of total duration
  const maxBreak = Math.floor(duration * 0.15)
  return Math.floor(Math.random() * maxBreak)
}

function createSessionTime(daysAgo: number, hourOfDay: number): Date {
  const now = new Date()
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hourOfDay, Math.floor(Math.random() * 60), 0, 0)
  return date
}

async function main() {
  console.log('🌱 Starting to seed session data...\n')

  // Get email from command line arguments
  const userEmail = process.argv[2]

  if (!userEmail) {
    console.error('❌ Please provide your email address as an argument.')
    console.error('\nUsage:')
    console.error('  bun run scripts/seed-sessions.ts your-email@example.com')
    console.error('  or')
    console.error('  bun run seed:sessions your-email@example.com')
    console.error('\nThe email should match your Clerk account email.\n')
    process.exit(1)
  }

  console.log(`Looking for user with email: ${userEmail}`)

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in environment variables')
    process.exit(1)
  }
  console.log('✓ DATABASE_URL is set')

  // Test database connection first
  console.log('Connecting to database (this may take 10-30 seconds if the database is sleeping)...')
  try {
    // Add a timeout promise to detect if connection is taking too long
    const connectPromise = db.$connect()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout after 45 seconds')), 45000)
    )

    await Promise.race([connectPromise, timeoutPromise])
    console.log('✓ Database connection established')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    console.error('\nPossible causes:')
    console.error('  1. Database is not running or suspended')
    console.error('  2. DATABASE_URL is incorrect')
    console.error('  3. Network/firewall issues')
    console.error('  4. Neon serverless database is taking too long to wake up')
    console.error('\nTry running the script again - serverless databases may need time to wake up.\n')
    process.exit(1)
  }

  // Find user in database
  let user
  try {
    user = await db.user.findUnique({
      where: { email: userEmail },
    })
  } catch (error) {
    console.error('❌ Database query failed:', error)
    process.exit(1)
  }

  if (!user) {
    console.error(`❌ No user found with email: ${userEmail}`)
    console.error('\nMake sure you:')
    console.error('  1. Have signed up/signed in to the application')
    console.error('  2. Are using the correct email address')
    console.error('  3. The user has been synced to the database\n')
    process.exit(1)
  }

  console.log(`✓ Found user: ${user.firstName} ${user.lastName} (${user.email})\n`)

  // Check for existing sessions
  const existingSessionCount = await db.session.count({
    where: { userId: user.id },
  })

  if (existingSessionCount > 0) {
    console.log(`⚠️  Found ${existingSessionCount} existing sessions.`)
    console.log('   This script will add MORE sessions to the existing data.')
    console.log('   To start fresh, delete existing sessions first.\n')
  }

  // Generate sessions for the past 30 days
  const sessionsToCreate = []
  let totalSessions = 0

  // Create a good streak (last 10 days with sessions)
  console.log('Creating sessions for a 10-day streak...')
  for (let day = 0; day < 10; day++) {
    // 2-4 sessions per day for streak days
    const sessionsPerDay = 2 + Math.floor(Math.random() * 3)

    for (let i = 0; i < sessionsPerDay; i++) {
      const hour = 8 + Math.floor(Math.random() * 10) // 8 AM to 6 PM
      const startTime = createSessionTime(day, hour)
      const duration = getRandomDuration()
      const breakTime = getRandomBreakTime(duration)
      const endTime = new Date(startTime.getTime() + (duration + breakTime) * 1000)

      sessionsToCreate.push({
        userId: user.id,
        title: getRandomElement(sessionTitles),
        startTime,
        endTime,
        duration, // Net focus time (excluding breaks)
        totalBreakTime: breakTime,
        breakCount: breakTime > 0 ? Math.floor(Math.random() * 3) + 1 : 0,
        notes: getRandomElement(sessionNotes),
        isPlanned: Math.random() > 0.3, // 70% planned, 30% ad-hoc
        completed: true,
        isPaused: false,
      })
      totalSessions++
    }
  }

  // Add some sessions from 11-30 days ago (sporadic)
  console.log('Creating sporadic sessions for days 11-30...')
  for (let day = 11; day < 30; day++) {
    // Only 50% of days have sessions
    if (Math.random() > 0.5) continue

    // 1-3 sessions for these days
    const sessionsPerDay = 1 + Math.floor(Math.random() * 3)

    for (let i = 0; i < sessionsPerDay; i++) {
      const hour = 8 + Math.floor(Math.random() * 10)
      const startTime = createSessionTime(day, hour)
      const duration = getRandomDuration()
      const breakTime = getRandomBreakTime(duration)
      const endTime = new Date(startTime.getTime() + (duration + breakTime) * 1000)

      sessionsToCreate.push({
        userId: user.id,
        title: getRandomElement(sessionTitles),
        startTime,
        endTime,
        duration,
        totalBreakTime: breakTime,
        breakCount: breakTime > 0 ? Math.floor(Math.random() * 3) + 1 : 0,
        notes: getRandomElement(sessionNotes),
        isPlanned: Math.random() > 0.4,
        completed: true,
        isPaused: false,
      })
      totalSessions++
    }
  }

  // Insert all sessions
  console.log(`\nInserting ${totalSessions} sessions into database...`)

  await db.session.createMany({
    data: sessionsToCreate,
  })

  console.log(`✅ Successfully created ${totalSessions} sessions!\n`)

  // Calculate and display statistics
  const allSessions = await db.session.findMany({
    where: {
      userId: user.id,
      completed: true,
    },
    select: {
      duration: true,
      startTime: true,
      isPlanned: true,
    },
  })

  const totalHours = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600
  const plannedCount = allSessions.filter(s => s.isPlanned).length
  const adhocCount = allSessions.length - plannedCount

  console.log('📊 Statistics:')
  console.log(`   Total Sessions: ${allSessions.length}`)
  console.log(`   Total Hours: ${totalHours.toFixed(1)}h`)
  console.log(`   Planned: ${plannedCount} (${Math.round(plannedCount / allSessions.length * 100)}%)`)
  console.log(`   Ad-hoc: ${adhocCount} (${Math.round(adhocCount / allSessions.length * 100)}%)`)
  console.log(`   Average Duration: ${Math.round(totalHours / allSessions.length * 60)} minutes`)

  console.log('\n✨ Seed data created successfully!')
  console.log('   Visit /dashboard/history to see your data\n')
}

main()
  .catch((error) => {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
