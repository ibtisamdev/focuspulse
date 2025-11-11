'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createPlannedBlock, updatePlannedBlock } from '@/app/actions/planner'
import type { PlannedBlock } from '@prisma/client'

interface EventModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  existingBlock?: PlannedBlock
  defaultDay?: number
  defaultTime?: string
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2.5 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
]

export function EventModal({
  open,
  onClose,
  mode,
  existingBlock,
  defaultDay,
  defaultTime,
}: EventModalProps) {
  const [title, setTitle] = useState(existingBlock?.title || '')
  const [dayOfWeek, setDayOfWeek] = useState<number>(
    existingBlock?.dayOfWeek ?? defaultDay ?? new Date().getDay()
  )
  const [startTime, setStartTime] = useState(
    existingBlock?.startTime || defaultTime || '09:00'
  )
  const [duration, setDuration] = useState(existingBlock?.duration || 90)
  const [isRecurring, setIsRecurring] = useState(existingBlock?.isRecurring || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'create') {
        await createPlannedBlock({
          title,
          dayOfWeek,
          startTime,
          duration,
          isRecurring,
        })
      } else if (existingBlock) {
        await updatePlannedBlock({
          id: existingBlock.id,
          title,
          dayOfWeek,
          startTime,
          duration,
          isRecurring,
        })
      }

      // Reset form and close
      resetForm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDayOfWeek(new Date().getDay())
    setStartTime('09:00')
    setDuration(90)
    setIsRecurring(false)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#18181b] border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 text-xl">
            {mode === 'create' ? 'Add Planned Block' : 'Edit Planned Block'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {mode === 'create'
              ? 'Schedule a new deep work block in your weekly planner.'
              : 'Update your planned deep work block.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-200 font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Deep Work: Feature Development"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            {/* Day of Week and Start Time - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Day of Week */}
              <div className="space-y-2">
                <Label htmlFor="day" className="text-zinc-200 font-medium">
                  Day of Week
                </Label>
                <Select
                  value={String(dayOfWeek)}
                  onValueChange={(value) => setDayOfWeek(Number(value))}
                >
                  <SelectTrigger
                    id="day"
                    className="bg-zinc-900 border-zinc-700 text-zinc-100"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem
                        key={day.value}
                        value={String(day.value)}
                        className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-50"
                      >
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-zinc-200 font-medium">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-zinc-200 font-medium">
                Duration
              </Label>
              <Select
                value={String(duration)}
                onValueChange={(value) => setDuration(Number(value))}
              >
                <SelectTrigger
                  id="duration"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                      className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-50"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurring Checkbox */}
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
                className="border-zinc-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label
                htmlFor="recurring"
                className="text-sm font-normal cursor-pointer text-zinc-300"
              >
                Repeat every week
              </Label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-md p-3">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
            >
              {isLoading
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                  ? 'Create Block'
                  : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
