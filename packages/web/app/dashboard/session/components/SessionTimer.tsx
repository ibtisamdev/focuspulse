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
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-zinc-50 tracking-tight animate-breathe"
        aria-live="polite"
        aria-atomic="true"
      >
        {formattedTime}
      </div>
    </div>
  )
}
