'use client'

import { useState } from 'react'
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
import { deletePlannedBlock } from '@/app/actions/planner'
import { extractTimeString } from '@/lib/utils/planner-db'
import type { PlannedBlock } from '@prisma/client'

interface DeleteEventDialogProps {
  open: boolean
  onClose: () => void
  block: PlannedBlock | null
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function DeleteEventDialog({ open, onClose, block }: DeleteEventDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Calculate day of week from startTime (Monday-based: 0 = Monday)
  const getDayOfWeek = (block: PlannedBlock) => {
    const date = block.specificDate || block.startTime
    return (date.getDay() + 6) % 7 // Convert to Monday-based
  }

  const handleDelete = async () => {
    if (!block) return

    setIsDeleting(true)
    try {
      await deletePlannedBlock(block.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete planned block:', error)
      alert('Failed to delete planned block. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!block) return null

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Planned Block?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this planned block?</p>
            <div className="mt-3 p-3 bg-zinc-900 rounded-md border border-zinc-800">
              <p className="font-semibold text-zinc-50">{block.title}</p>
              <p className="text-sm text-zinc-400 mt-1">
                {block.isRecurring
                  ? `${DAYS_OF_WEEK[getDayOfWeek(block)]} at ${extractTimeString(block.startTime)}`
                  : block.specificDate
                    ? `${block.specificDate.toLocaleDateString()} at ${extractTimeString(block.startTime)}`
                    : `${extractTimeString(block.startTime)}`
                }
              </p>
              <p className="text-sm text-zinc-400">
                Duration: {block.duration} minutes
              </p>
              {block.isRecurring && (
                <p className="text-sm text-blue-400 mt-1">Recurring weekly</p>
              )}
            </div>
            <p className="text-zinc-400 mt-3">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete Block'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
