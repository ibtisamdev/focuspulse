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

interface SessionTitleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const QUICK_TEMPLATES = [
  'Deep Work Session',
  'Project Work',
  'Learning & Research',
  'Writing',
  'Code Review',
  'Planning',
]

export function SessionTitleModal({ open, onOpenChange }: SessionTitleModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please enter a session title')
      return
    }
    if (trimmedTitle.length > 100) {
      setError('Title must be 100 characters or less')
      return
    }

    // Navigate to session page with title
    router.push(`/dashboard/session?title=${encodeURIComponent(trimmedTitle)}`)

    // Reset and close
    setTitle('')
    setError('')
    onOpenChange(false)
  }

  const handleTemplateClick = (template: string) => {
    setTitle(template)
    setError('')
  }

  const handleCancel = () => {
    setTitle('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#18181b] border-zinc-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Start Focus Session</DialogTitle>
            <DialogDescription className="text-zinc-400">
              What will you be working on?
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-zinc-300">
                Session Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  setError('')
                }}
                placeholder="e.g., Deep Work Session"
                className="bg-[#09090b] border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                autoFocus
                maxLength={100}
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            {/* Quick Templates */}
            <div className="grid gap-2">
              <Label className="text-zinc-300">Quick Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_TEMPLATES.map((template) => (
                  <Button
                    key={template}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateClick(template)}
                    className="justify-start text-xs bg-[#09090b] border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50"
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-zinc-800 bg-[#09090b] text-zinc-400 hover:bg-zinc-800/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
            >
              Start Session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
