import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton (Optimized for Serverless)
 *
 * This configuration is optimized for Next.js on Vercel with Neon PostgreSQL:
 * - Prevents multiple instances due to hot reloading in development
 * - Configures appropriate logging for each environment
 * - Optimizes connection pooling for serverless (Vercel Functions)
 * - Uses Neon's pooled connection endpoint for best performance
 *
 * Documentation: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],

  // Optimize for serverless environments (Vercel)
  // Neon's pooled connection handles connection pooling
  // So we don't need to configure it here
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Graceful shutdown for serverless
// This ensures connections are properly closed
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}
