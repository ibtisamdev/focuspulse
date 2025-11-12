'use client'

import { useEffect } from 'react'

/**
 * Global Error Boundary
 *
 * This catches errors in the root layout and provides a minimal
 * fallback UI. It must be a minimal component as the root layout
 * may have failed to load.
 *
 * Documentation: https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#09090b',
        color: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{
          maxWidth: '500px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}>
            Application Error
          </h1>

          <p style={{
            color: '#a1a1aa',
            marginBottom: '2rem',
          }}>
            A critical error occurred. Please refresh the page to try again.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div style={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}>
              <code style={{
                fontSize: '0.875rem',
                color: '#f87171',
                wordBreak: 'break-word',
              }}>
                {error.message}
              </code>
            </div>
          )}

          <button
            onClick={reset}
            style={{
              backgroundColor: '#fafafa',
              color: '#09090b',
              padding: '0.75rem 2rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '1rem',
            }}
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: 'transparent',
              color: '#fafafa',
              padding: '0.75rem 2rem',
              borderRadius: '0.375rem',
              border: '1px solid #27272a',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Go Home
          </button>
        </div>
      </body>
    </html>
  )
}
