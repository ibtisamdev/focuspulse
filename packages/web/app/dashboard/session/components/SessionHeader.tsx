'use client'

import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * SessionHeader Component
 *
 * Top bar with FocusPulse branding and settings
 * Minimal, non-intrusive design
 */
export function SessionHeader() {
  return (
    <div className="absolute top-4 sm:top-6 left-0 right-0 px-4 sm:px-6 z-20 flex items-center justify-between">
      {/* Left: Branding */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-base sm:text-lg font-semibold text-zinc-400">FocusPulse</div>
        <div className="w-px h-4 bg-zinc-800" />
        <div className="text-xs text-zinc-500 uppercase tracking-wider">
          Active Session
        </div>
      </div>

      {/* Right: Settings */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 sm:h-10 sm:w-10 border-zinc-800 bg-[#18181b] hover:bg-zinc-800/50"
      >
        <Settings className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-zinc-400" />
        <span className="sr-only">Settings</span>
      </Button>
    </div>
  )
}
