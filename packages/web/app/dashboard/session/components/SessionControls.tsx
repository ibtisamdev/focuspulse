'use client'

import { useState } from 'react'
import { Pause, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface SessionControlsProps {
  isPaused: boolean
  formattedTime: string
  onPause: () => void
  onResume: () => void
  onEnd: (notes?: string) => void
}

/**
 * SessionControls Component
 *
 * Floating action buttons for controlling the session
 * Includes modals for break confirmation and end session with notes
 */
export function SessionControls({
  isPaused,
  formattedTime,
  onPause,
  onResume,
  onEnd,
}: SessionControlsProps) {
  const [showBreakDialog, setShowBreakDialog] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [notes, setNotes] = useState('')

  const handleBreakClick = () => {
    setShowBreakDialog(true)
  }

  const handleBreakConfirm = () => {
    onPause()
    setShowBreakDialog(false)
  }

  const handleEndClick = () => {
    setShowEndDialog(true)
  }

  const handleEndConfirm = () => {
    onEnd(notes)
    setShowEndDialog(false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-fade-in px-4 max-w-full">
        {/* Take Break / Resume Button */}
        <Button
          variant="outline"
          size="lg"
          className="h-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-zinc-800 bg-[#18181b] hover:bg-zinc-800/80 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          onClick={isPaused ? onResume : handleBreakClick}
        >
          <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 mr-2 sm:mr-3" />
          <span className="text-xs sm:text-sm font-medium text-zinc-400">
            {isPaused ? 'Resume' : 'Take Break'}
          </span>
        </Button>

        {/* End Session Button */}
        <Button
          size="lg"
          className="h-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-zinc-50 hover:bg-zinc-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          onClick={handleEndClick}
        >
          <Square className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-900 mr-2 sm:mr-3 fill-zinc-900" />
          <span className="text-xs sm:text-sm font-medium text-zinc-900">End Session</span>
        </Button>
      </div>

      {/* Break Confirmation Dialog */}
      <AlertDialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <AlertDialogContent className="bg-[#18181b] border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-50">
              Take a Break?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Current session time: <strong>{formattedTime}</strong>
              <br />
              <br />
              The timer will pause and you can resume later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
              onClick={handleBreakConfirm}
            >
              Take Break
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="bg-[#18181b] border-zinc-800 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">End Session?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Total focus time: <strong>{formattedTime}</strong>
              <br />
              <br />
              Add any notes about what you accomplished (optional):
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="What did you accomplish during this session?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEndDialog(false)}
              className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEndConfirm}
              className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
            >
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
