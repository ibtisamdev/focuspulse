/**
 * Production Logger
 *
 * Environment-aware logging utility for Next.js Server Actions
 * In production, reduces verbose logging while maintaining error tracking
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Log error messages (always logged in all environments)
 */
export function logError(message: string, error?: unknown) {
  console.error(`[ERROR] ${message}`, error)

  // In production, you would send this to an error tracking service
  // Example: Sentry.captureException(error)
}

/**
 * Log warning messages (logged in all environments)
 */
export function logWarning(message: string, data?: unknown) {
  console.warn(`[WARNING] ${message}`, data)
}

/**
 * Log info messages (only in development)
 */
export function logInfo(message: string, data?: unknown) {
  if (isDevelopment) {
    console.log(`[INFO] ${message}`, data)
  }
}

/**
 * Log debug messages (only in development)
 */
export function logDebug(message: string, data?: unknown) {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, data)
  }
}

/**
 * Log server action execution (useful for debugging)
 */
export function logServerAction(actionName: string, userId?: string) {
  if (isDevelopment) {
    console.log(`[SERVER ACTION] ${actionName}`, userId ? `User: ${userId}` : '')
  }
}

/**
 * Log database query performance (only in development)
 */
export function logQueryPerformance(queryName: string, duration: number) {
  if (isDevelopment && duration > 100) {
    console.warn(`[SLOW QUERY] ${queryName} took ${duration}ms`)
  }
}

export const logger = {
  error: logError,
  warning: logWarning,
  info: logInfo,
  debug: logDebug,
  serverAction: logServerAction,
  queryPerformance: logQueryPerformance,
}
