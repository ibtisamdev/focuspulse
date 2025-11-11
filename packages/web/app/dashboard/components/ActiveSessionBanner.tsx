'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle, Play, StopCircle } from 'lucide-react'
import { endSession } from '@/app/actions/session'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ActiveSessionBannerProps {
  sessionId: string
  title: string
  startTime: Date
}

export function ActiveSessionBanner({ sessionId, title, startTime }: ActiveSessionBannerProps) {
  const router = useRouter()
  const [elapsedTime, setElapsedTime] = useState('')
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [isEnding, setIsEnding] = useState(false)

  // Calculate and update elapsed time
  useEffect(() => {
    const updateElapsedTime = () => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000)

      const hours = Math.floor(elapsed / 3600)
      const minutes = Math.floor((elapsed % 3600) / 60)
      const seconds = elapsed % 60

      if (hours > 0) {
        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`)
      } else if (minutes > 0) {
        setElapsedTime(`${minutes}m ${seconds}s`)
      } else {
        setElapsedTime(`${seconds}s`)
      }
    }

    updateElapsedTime()
    const interval = setInterval(updateElapsedTime, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const handleResume = () => {
    router.push(`/dashboard/session/${sessionId}`)
  }

  const handleEnd = async () => {
    setIsEnding(true)
    try {
      await endSession(sessionId)
      router.refresh() // Refresh to update the dashboard
      setShowEndDialog(false)
    } catch (error) {
      console.error('Error ending session:', error)
      alert('Failed to end session. Please try again.')
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-zinc-400 animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-zinc-50 truncate">{title}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Session in progress • {elapsedTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResume}
              className="border-zinc-700 bg-zinc-800/50 text-zinc-50 hover:bg-zinc-700 h-8 text-xs gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEndDialog(true)}
              className="border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 h-8 text-xs gap-1.5"
            >
              <StopCircle className="h-3.5 w-3.5" />
              End
            </Button>
          </div>
        </div>
      </div>

      {/* End Session Confirmation Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent className="bg-[#18181b] border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-50">End Session?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to end "{title}"? Your progress will be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-800 bg-[#09090b] text-zinc-400 hover:bg-zinc-800/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEnd}
              disabled={isEnding}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isEnding ? 'Ending...' : 'End Session'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
