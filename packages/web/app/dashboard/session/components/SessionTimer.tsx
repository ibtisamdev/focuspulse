'use client'

import { cn } from '@/lib/utils'

interface SessionTimerProps {
  formattedTime: string
  className?: string
}

/**
 * SessionTimer Component
 *
 * Displays the timer with breathing animation effect
 * Large, centered display for focus
 */
export function SessionTimer({ formattedTime, className }: SessionTimerProps) {
  return (
    <div className={cn('text-center', className)}>
      <div
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-50 tracking-tight animate-breathe"
        aria-live="polite"
        aria-atomic="true"
      >
        {formattedTime}
      </div>
    </div>
  )
}
