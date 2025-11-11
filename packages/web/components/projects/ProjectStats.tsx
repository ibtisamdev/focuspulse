import { BookOpen, Clock, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ProjectStatsProps {
  totalProjects: number
  activeProjects: number
  completedProjects: number
}

export function ProjectStats({
  totalProjects,
  activeProjects,
  completedProjects
}: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Projects */}
      <Card className="bg-[#18181b] border-zinc-800 p-6 hover:bg-zinc-900/50 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-400">Total Projects</span>
          <BookOpen className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="text-2xl font-semibold text-zinc-50 mb-1">{totalProjects}</div>
        <p className="text-xs text-zinc-500">Across all teams</p>
      </Card>

      {/* Active Projects */}
      <Card className="bg-[#18181b] border-zinc-800 p-6 hover:bg-zinc-900/50 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-400">Active Projects</span>
          <Clock className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="text-2xl font-semibold text-zinc-50 mb-1">{activeProjects}</div>
        <p className="text-xs text-zinc-500">In progress</p>
      </Card>

      {/* Completed Projects */}
      <Card className="bg-[#18181b] border-zinc-800 p-6 hover:bg-zinc-900/50 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-400">Completed</span>
          <CheckCircle className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="text-2xl font-semibold text-zinc-50 mb-1">{completedProjects}</div>
        <p className="text-xs text-zinc-500">This quarter</p>
      </Card>
    </div>
  )
}
