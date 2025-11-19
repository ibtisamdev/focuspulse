'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createPlannedBlock, updatePlannedBlock } from '@/app/actions/planner'
import { extractTimeString, combineDateAndTime } from '@/lib/utils/planner-db'
import type { PlannedBlock } from '@prisma/client'
import { cn } from '@/lib/utils'

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
    existingBlock?.startTime ? extractTimeString(existingBlock.startTime) : (defaultTime || '09:00')
  )
  const [duration, setDuration] = useState(existingBlock?.duration || 90)
  const [isRecurring, setIsRecurring] = useState(existingBlock?.isRecurring || false)
  const [specificDate, setSpecificDate] = useState<Date | undefined>(() => {
    // If editing an existing block with a specificDate, use it
    if (existingBlock?.specificDate) {
      return new Date(existingBlock.specificDate)
    }
    // For new non-recurring events, initialize with today's date
    // (This provides a better UX - user can adjust from here)
    if (!existingBlock && !isRecurring) {
      return new Date()
    }
    return undefined
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update dayOfWeek when specificDate changes
  const handleDateChange = (date: Date | undefined) => {
    setSpecificDate(date)
    if (date) {
      // Update dayOfWeek to match the selected date
      setDayOfWeek(date.getDay())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Convert time string to DateTime
      // For recurring events, use epoch date (1970-01-01)
      // For one-time events, use specificDate
      const referenceDate = isRecurring
        ? new Date('1970-01-01')
        : (specificDate || new Date())
      const startTimeDate = combineDateAndTime(referenceDate, startTime)

      // For non-recurring events, derive dayOfWeek from specificDate
      // For recurring events, use the selected dayOfWeek
      const dayOfWeekValue = isRecurring
        ? dayOfWeek
        : (specificDate ? specificDate.getDay() : undefined)

      if (mode === 'create') {
        await createPlannedBlock({
          title,
          dayOfWeek: dayOfWeekValue,
          startTime: startTimeDate,
          duration,
          isRecurring,
          specificDate,
          // New required fields with defaults
          category: 'OTHER' as const,
          priority: 0,
          tags: [],
          recurrenceDays: [],
          isActive: true,
        })
      } else if (existingBlock) {
        await updatePlannedBlock({
          id: existingBlock.id,
          title,
          dayOfWeek: dayOfWeekValue,
          startTime: startTimeDate,
          duration,
          isRecurring,
          specificDate,
          // Preserve existing values or use defaults
          category: existingBlock.category,
          priority: existingBlock.priority,
          tags: existingBlock.tags,
          recurrenceDays: existingBlock.recurrenceDays,
          isActive: existingBlock.isActive,
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
    setSpecificDate(undefined)
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
          <div className="py-4">
            {/* GROUP 1: Title */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="title" className="text-zinc-200 font-medium">
                Title <span className="text-red-400">*</span>
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

            {/* GROUP 2: Recurring Decision */}
            <div className="flex items-center space-x-3 mb-5">
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

            {/* GROUP 3: Date & Time Fields */}
            <div className="space-y-4 mb-5">
              {isRecurring ? (
                <>
                  {/* Recurring: Day of Week + Start Time side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day" className="text-zinc-200 font-medium">
                        Day of Week <span className="text-red-400">*</span>
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

                    <div className="space-y-2">
                      <Label htmlFor="startTime" className="text-zinc-200 font-medium">
                        Start Time <span className="text-red-400">*</span>
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
                </>
              ) : (
                <>
                  {/* One-time: Specific Date, then Start Time */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-zinc-200 font-medium">
                      Specific Date <span className="text-red-400">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal bg-zinc-900 border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50',
                            !specificDate && 'text-zinc-500'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {specificDate ? (
                            format(specificDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                        <Calendar
                          mode="single"
                          selected={specificDate}
                          onSelect={handleDateChange}
                          initialFocus
                          className="bg-zinc-900"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-zinc-200 font-medium">
                      Start Time <span className="text-red-400">*</span>
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
                </>
              )}

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
