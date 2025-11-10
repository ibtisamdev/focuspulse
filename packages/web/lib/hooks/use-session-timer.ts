'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface SessionTimerState {
  elapsedSeconds: number
  isRunning: boolean
  isPaused: boolean
  formattedTime: string
}

export interface SessionTimerControls {
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
}

export interface UseSessionTimerOptions {
  initialElapsedSeconds?: number
  onTick?: (elapsedSeconds: number) => void
  autoStart?: boolean
}

/**
 * Custom hook for managing session timer state and controls
 *
 * Features:
 * - Count up timer starting from 0 or initial value
 * - Pause/resume functionality
 * - Format time as HH:MM:SS
 * - Keyboard shortcuts (ESC, Space)
 * - Auto-save capability with callback
 *
 * @example
 * const { elapsedSeconds, formattedTime, isRunning, pause, resume, stop } = useSessionTimer({
 *   autoStart: true,
 *   onTick: (seconds) => console.log(`Elapsed: ${seconds}s`)
 * })
 */
export function useSessionTimer(options: UseSessionTimerOptions = {}) {
  const {
    initialElapsedSeconds = 0,
    onTick,
    autoStart = false,
  } = options

  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [])

  const formattedTime = formatTime(elapsedSeconds)

  // Start timer
  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false)
    setIsPaused(true)
  }, [])

  // Resume timer
  const resume = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  // Stop timer completely
  const stop = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Reset timer to 0
  const reset = useCallback(() => {
    stop()
    setElapsedSeconds(0)
  }, [stop])

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newValue = prev + 1
          // Call onTick callback if provided
          if (onTick) {
            onTick(newValue)
          }
          return newValue
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, onTick])

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key - for ending session (handled by component)
      // Space key - for pausing/resuming
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        if (isRunning) {
          pause()
        } else if (isPaused) {
          resume()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, isPaused, pause, resume])

  // Prevent page unload when timer is running
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRunning || (elapsedSeconds > 0 && !isPaused)) {
        e.preventDefault()
        e.returnValue = 'You have an active session. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isRunning, elapsedSeconds, isPaused])

  const state: SessionTimerState = {
    elapsedSeconds,
    isRunning,
    isPaused,
    formattedTime,
  }

  const controls: SessionTimerControls = {
    start,
    pause,
    resume,
    stop,
    reset,
  }

  return {
    ...state,
    ...controls,
  }
}

/**
 * Helper function to convert seconds to human-readable format
 * Example: 3665 seconds -> "1 hour 1 minute"
 */
export function formatDurationHuman(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  }

  if (parts.length === 0) {
    return 'Less than a minute'
  }

  return parts.join(' ')
}
