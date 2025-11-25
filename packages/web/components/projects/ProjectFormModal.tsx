'use client'

import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createProject, updateProject } from '@/app/actions/project'
import { cn } from '@/lib/utils'
import type { Project } from '@prisma/client'

interface ProjectFormModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  mode: 'create' | 'edit'
  existingProject?: Project
}

const PROJECT_COLORS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#f97316', label: 'Orange' },
  { value: '#22c55e', label: 'Green' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#ef4444', label: 'Red' },
]

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
]

export function ProjectFormModal({
  open,
  onClose,
  onSuccess,
  mode,
  existingProject,
}: ProjectFormModalProps) {
  const [name, setName] = useState(existingProject?.name || '')
  const [description, setDescription] = useState(existingProject?.description || '')
  const [color, setColor] = useState(existingProject?.color || '#3b82f6')
  const [status, setStatus] = useState<string>(existingProject?.status || 'ACTIVE')
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingProject?.startDate ? new Date(existingProject.startDate) : undefined
  )
  const [dueDate, setDueDate] = useState<Date | undefined>(
    existingProject?.dueDate ? new Date(existingProject.dueDate) : undefined
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (open) {
      setName(existingProject?.name || '')
      setDescription(existingProject?.description || '')
      setColor(existingProject?.color || '#3b82f6')
      setStatus(existingProject?.status || 'ACTIVE')
      setStartDate(existingProject?.startDate ? new Date(existingProject.startDate) : undefined)
      setDueDate(existingProject?.dueDate ? new Date(existingProject.dueDate) : undefined)
      setError(null)
    }
  }, [open, existingProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'create') {
        const result = await createProject({
          name,
          description: description || undefined,
          color,
          status: status as 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED',
          startDate,
          dueDate,
        })

        if (result.error) {
          setError(result.error)
          setIsLoading(false)
          return
        }

        onSuccess?.()
        onClose()
      } else if (existingProject) {
        const result = await updateProject(existingProject.id, {
          name,
          description: description || undefined,
          color,
          status: status as 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED',
          startDate,
          dueDate,
        })

        if (result.error) {
          setError(result.error)
          setIsLoading(false)
          return
        }

        onSuccess?.()
        onClose()
      }
    } catch (err) {
      console.error('Error saving project:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#18181b] border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-50">
            {mode === 'create' ? 'Create New Project' : 'Edit Project'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {mode === 'create'
              ? 'Add a new project to track your work and time.'
              : 'Update your project details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Project Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Website Redesign"
                className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                required
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project..."
                className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Color and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color" className="text-zinc-300">Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger id="color" className="bg-[#09090b] border-zinc-800 text-zinc-50">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {PROJECT_COLORS.find((c) => c.value === color)?.label}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-zinc-800">
                    {PROJECT_COLORS.map((colorOption) => (
                      <SelectItem key={colorOption.value} value={colorOption.value} className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: colorOption.value }}
                          />
                          {colorOption.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-zinc-300">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="bg-[#09090b] border-zinc-800 text-zinc-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#18181b] border-zinc-800">
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-zinc-50 focus:bg-zinc-800 focus:text-zinc-50">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal bg-[#09090b] border-zinc-800 text-zinc-50 hover:bg-zinc-800/50',
                        !startDate && 'text-zinc-500'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#18181b] border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="bg-[#18181b] text-zinc-50"
                      classNames={{
                        months: "text-zinc-50",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-zinc-50",
                        caption_label: "text-sm font-medium text-zinc-50",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-zinc-50",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 rounded-md",
                        day_selected: "bg-zinc-50 text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-50 focus:text-zinc-900",
                        day_today: "bg-zinc-800 text-zinc-50",
                        day_outside: "text-zinc-600 opacity-50",
                        day_disabled: "text-zinc-600 opacity-50",
                        day_range_middle: "aria-selected:bg-zinc-800 aria-selected:text-zinc-50",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal bg-[#09090b] border-zinc-800 text-zinc-50 hover:bg-zinc-800/50',
                        !dueDate && 'text-zinc-500'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#18181b] border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      disabled={(date) => {
                        // Disable dates before start date if start date is set
                        if (startDate) {
                          return date < startDate
                        }
                        return false
                      }}
                      className="bg-[#18181b] text-zinc-50"
                      classNames={{
                        months: "text-zinc-50",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-zinc-50",
                        caption_label: "text-sm font-medium text-zinc-50",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-zinc-50",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 rounded-md",
                        day_selected: "bg-zinc-50 text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-50 focus:text-zinc-900",
                        day_today: "bg-zinc-800 text-zinc-50",
                        day_outside: "text-zinc-600 opacity-50",
                        day_disabled: "text-zinc-600 opacity-50",
                        day_range_middle: "aria-selected:bg-zinc-800 aria-selected:text-zinc-50",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-zinc-800 bg-[#09090b] text-zinc-400 hover:bg-zinc-800/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
            >
              {isLoading
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                ? 'Create Project'
                : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
