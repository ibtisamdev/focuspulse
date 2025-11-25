'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MoreVertical, Pencil, Trash2, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { ProjectFormModal } from './ProjectFormModal'
import { deleteProject } from '@/app/actions/project'
import { cn } from '@/lib/utils'
import type { Project } from '@prisma/client'

interface ProjectCardProps {
  project: Project & {
    _count: {
      sessions: number
      plannedBlocks: number
    }
  }
  onUpdate?: () => void
}

const statusConfig = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    progressColor: 'bg-emerald-500'
  },
  ON_HOLD: {
    label: 'On Hold',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    progressColor: 'bg-yellow-500'
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    progressColor: 'bg-blue-500'
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    progressColor: 'bg-zinc-500'
  }
}

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const status = statusConfig[project.status]

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProject(project.id)
      if (result.success) {
        onUpdate?.()
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return format(new Date(date), 'MMM d, yyyy')
  }

  const dueDateDisplay = project.status === 'COMPLETED' && project.completedAt
    ? `Completed ${formatDate(project.completedAt)}`
    : project.dueDate
    ? `Due ${formatDate(project.dueDate)}`
    : null

  return (
    <>
      <Card
        className="bg-[#18181b] border-zinc-800 p-6 hover:bg-zinc-900/50 transition-colors cursor-pointer group relative"
        onClick={() => router.push(`/projects/${project.id}`)}
      >
        {/* Actions Menu */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4 pr-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {project.color && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
              )}
              <h3 className="text-lg font-semibold text-zinc-50 truncate">{project.name}</h3>
            </div>
            <p className="text-sm text-zinc-400 line-clamp-2">{project.description}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <Badge className={cn('px-2 py-1 text-xs font-medium border', status.className)}>
            {status.label}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={cn('h-full transition-all', status.progressColor)}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-4">
          {dueDateDisplay && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{dueDateDisplay}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{project._count.sessions} sessions</span>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <ProjectFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          onUpdate?.()
          setIsEditModalOpen(false)
        }}
        mode="edit"
        existingProject={project}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This will archive the project
              and it won't appear in your active projects list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
