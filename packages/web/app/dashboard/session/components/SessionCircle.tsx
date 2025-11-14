'use client'

import { cn } from '@/lib/utils'

interface SessionCircleProps {
  children: React.ReactNode
  className?: string
}

/**
 * SessionCircle Component
 *
 * Circular container with glow effect and rotating border
 * Houses the main session information
 */
export function SessionCircle({ children, className }: SessionCircleProps) {
  return (
    <div className="relative mb-6 sm:mb-8">
      {/* Main circle with glow */}
      <div
        className={cn(
          'relative bg-[#18181b] border-2 border-zinc-800 rounded-full p-8 sm:p-10 md:p-12 animate-glow overflow-hidden',
          className
        )}
      >
        {/* Rotating border effect */}
        <div className="absolute inset-0 animate-rotate opacity-20 pointer-events-none">
          <div
            className="w-full h-full border-2 border-zinc-700 rounded-full"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 10%, 0 10%)' }}
          />
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}
