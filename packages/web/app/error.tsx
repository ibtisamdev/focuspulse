'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Error Boundary for Route Segments
 *
 * This component catches errors in any route segment and displays
 * a user-friendly error message with a retry option.
 *
 * Documentation: https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    // In production, you'd send this to an error tracking service (e.g., Sentry)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-50">
            Something went wrong!
          </h2>
          <p className="text-zinc-400">
            We encountered an unexpected error. Please try again.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left">
            <p className="text-sm font-mono text-red-400">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs text-zinc-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        <p className="text-sm text-zinc-500">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}
