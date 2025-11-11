import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Project } from './types'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    progressColor: 'bg-emerald-500'
  },
  'on-hold': {
    label: 'On Hold',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    progressColor: 'bg-yellow-500'
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    progressColor: 'bg-blue-500'
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status]

  return (
    <Card className="bg-[#18181b] border-zinc-800 p-6 hover:bg-zinc-900/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-50 mb-1">{project.name}</h3>
          <p className="text-sm text-zinc-400">{project.description}</p>
        </div>
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
            className={cn('h-full', status.progressColor)}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Due Date and Team Members */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{project.dueDate}</span>
        </div>
        <div className="flex -space-x-2">
          {project.teamMembers.map((member) => (
            <Avatar
              key={member.id}
              className="h-7 w-7 border-2 border-[#18181b]"
            >
              <AvatarFallback
                className={cn('text-xs font-medium', member.color)}
              >
                {member.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-zinc-900 text-zinc-400 text-xs rounded-md border border-zinc-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </Card>
  )
}
