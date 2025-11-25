'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectStats } from '@/components/projects/ProjectStats'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { getProjects } from '@/app/actions/project'
import type { Project } from '@prisma/client'

type ProjectWithCounts = Project & {
  _count: {
    sessions: number
    plannedBlocks: number
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithCounts[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithCounts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Fetch projects on mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Apply filters whenever projects or filters change
  useEffect(() => {
    applyFilters()
  }, [projects, searchQuery, statusFilter])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const result = await getProjects()
      if (result.success && result.projects) {
        setProjects(result.projects)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = projects

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status.toLowerCase() === statusFilter)
    }

    setFilteredProjects(filtered)
  }

  const handleFilterChange = (search: string, status: string) => {
    setSearchQuery(search)
    setStatusFilter(status)
  }

  // Calculate stats
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-semibold text-zinc-50">Projects</h1>
          <Button
            className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create New Project
          </Button>
        </div>
        <p className="text-sm text-zinc-400">Manage and track your ongoing projects</p>
      </div>

      {/* Stats Summary */}
      <ProjectStats
        totalProjects={totalProjects}
        activeProjects={activeProjects}
        completedProjects={completedProjects}
      />

      {/* Filter/Search Bar */}
      <ProjectFilters onFilterChange={handleFilterChange} />

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-zinc-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-zinc-400 mb-4">
            {projects.length === 0
              ? 'No projects yet. Create your first project to get started!'
              : 'No projects match your filters.'}
          </p>
          {projects.length === 0 && (
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onUpdate={loadProjects} />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadProjects}
        mode="create"
      />
    </main>
  )
}
