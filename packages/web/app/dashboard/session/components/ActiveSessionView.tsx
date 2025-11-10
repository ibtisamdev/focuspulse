'use client'

import { useRouter } from 'next/navigation'
import { useSessionTimer } from '@/lib/hooks/use-session-timer'
import { SessionTimer } from './SessionTimer'
import { SessionCircle } from './SessionCircle'
import { SessionHeader } from './SessionHeader'
import { SessionStats } from './SessionStats'
import { SessionControls } from './SessionControls'

interface ActiveSessionViewProps {
  sessionId: string
  title: string
  startTime: Date
  initialElapsedSeconds?: number
  sessionsToday: number
  focusTime: string
  target: string
  onUpdateSession: (sessionId: string, data: { isPaused: boolean; pausedAt?: Date }) => Promise<void>
  onEndSession: (sessionId: string, notes?: string) => Promise<void>
}

/**
 * ActiveSessionView Component
 *
 * Main client component that orchestrates the entire active session UI
 * Handles timer logic, animations, and user interactions
 */
export function ActiveSessionView({
  sessionId,
  title,
  startTime,
  initialElapsedSeconds = 0,
  sessionsToday,
  focusTime,
  target,
  onUpdateSession,
  onEndSession,
}: ActiveSessionViewProps) {
  const router = useRouter()

  const {
    formattedTime,
    elapsedSeconds,
    isRunning,
    isPaused,
    pause,
    resume,
  } = useSessionTimer({
    initialElapsedSeconds,
    autoStart: true,
    onTick: (seconds) => {
      // Auto-save every 30 seconds
      if (seconds > 0 && seconds % 30 === 0) {
        onUpdateSession(sessionId, {
          isPaused: false,
        }).catch(console.error)
      }
    },
  })

  const handlePause = async () => {
    pause()
    await onUpdateSession(sessionId, {
      isPaused: true,
      pausedAt: new Date(),
    })
  }

  const handleResume = async () => {
    resume()
    await onUpdateSession(sessionId, {
      isPaused: false,
    })
  }

  const handleEnd = async (notes?: string) => {
    await onEndSession(sessionId, notes)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  // Format start time
  const formatStartTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`
  }

  return (
    <div className="h-screen w-screen flex flex-col relative bg-gradient-to-b from-[#09090b] via-[#0f0f12] to-[#09090b] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left corner accent */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-zinc-800 opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Bottom right corner accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-800 opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <SessionHeader />

      {/* Main Content - Centered with flex-1 to take available space */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-16 sm:pt-20 pb-4 animate-fade-in">
        <SessionCircle>
          {/* Task Title */}
          <div className="text-center mb-6">
            <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Current Task
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-50">{title}</h1>
          </div>

          {/* Timer Display */}
          <SessionTimer formattedTime={formattedTime} className="mb-6" />

          {/* Session Start Time */}
          <div className="text-center">
            <div className="text-xs text-zinc-500">Started at</div>
            <div className="text-sm text-zinc-400 mt-1">
              {formatStartTime(startTime)}
            </div>
          </div>
        </SessionCircle>

        {/* Session Stats */}
        <SessionStats
          sessionsToday={sessionsToday}
          focusTime={focusTime}
          target={target}
        />
      </div>

      {/* Controls - Fixed at bottom with proper padding */}
      <div className="relative z-20 pb-8 pt-4">
        <SessionControls
          isPaused={isPaused}
          formattedTime={formattedTime}
          onPause={handlePause}
          onResume={handleResume}
          onEnd={handleEnd}
        />
      </div>
    </div>
  )
}
