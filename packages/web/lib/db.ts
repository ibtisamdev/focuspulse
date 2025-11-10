import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton
 *
 * This prevents multiple instances of Prisma Client in development
 * due to hot reloading. In production, it creates a single instance.
 *
 * Documentation: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
