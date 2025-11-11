import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectStats } from '@/components/projects/ProjectStats'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { Project } from '@/components/projects/types'

// Mock data matching the HTML file
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    progress: 68,
    dueDate: 'Due Dec 15, 2025',
    teamMembers: [
      { id: '1', name: 'Alex Morgan', initials: 'AM', color: 'bg-blue-500' },
      { id: '2', name: 'Sarah Kim', initials: 'SK', color: 'bg-purple-500' },
      { id: '3', name: 'John Lee', initials: 'JL', color: 'bg-pink-500' }
    ],
    tags: ['Design', 'Frontend', 'High Priority']
  },
  {
    id: '2',
    name: 'Mobile App Launch',
    description: 'iOS and Android app development and deployment',
    status: 'active',
    progress: 42,
    dueDate: 'Due Jan 30, 2026',
    teamMembers: [
      { id: '4', name: 'Rachel Kim', initials: 'RK', color: 'bg-orange-500' },
      { id: '5', name: 'Mike Park', initials: 'MP', color: 'bg-teal-500' }
    ],
    tags: ['Mobile', 'React Native']
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Connect third-party services and build REST API',
    status: 'on-hold',
    progress: 28,
    dueDate: 'Due Nov 20, 2025',
    teamMembers: [
      { id: '6', name: 'David Wang', initials: 'DW', color: 'bg-indigo-500' },
      { id: '7', name: 'Tom Harris', initials: 'TH', color: 'bg-green-500' },
      { id: '8', name: 'Lisa Chen', initials: 'LC', color: 'bg-red-500' }
    ],
    tags: ['Backend', 'API']
  },
  {
    id: '4',
    name: 'Marketing Campaign',
    description: 'Q4 product launch marketing materials and strategy',
    status: 'completed',
    progress: 100,
    dueDate: 'Completed Oct 28, 2025',
    teamMembers: [
      { id: '9', name: 'Nina Patel', initials: 'NP', color: 'bg-cyan-500' },
      { id: '10', name: 'Ben Foster', initials: 'BF', color: 'bg-violet-500' }
    ],
    tags: ['Marketing', 'Content']
  },
  {
    id: '5',
    name: 'Database Migration',
    description: 'Migrate from MongoDB to PostgreSQL infrastructure',
    status: 'active',
    progress: 85,
    dueDate: 'Due Nov 25, 2025',
    teamMembers: [
      { id: '11', name: 'James Smith', initials: 'JS', color: 'bg-amber-500' },
      { id: '12', name: 'Kate Wilson', initials: 'KW', color: 'bg-lime-500' }
    ],
    tags: ['Database', 'Infrastructure', 'High Priority']
  },
  {
    id: '6',
    name: 'User Analytics Dashboard',
    description: 'Build comprehensive analytics and reporting system',
    status: 'active',
    progress: 55,
    dueDate: 'Due Dec 10, 2025',
    teamMembers: [
      { id: '13', name: 'Anna Lee', initials: 'AL', color: 'bg-rose-500' },
      { id: '14', name: 'Mark Garcia', initials: 'MG', color: 'bg-sky-500' },
      { id: '15', name: 'Victoria Taylor', initials: 'VT', color: 'bg-emerald-500' }
    ],
    tags: ['Analytics', 'Data Viz']
  },
  {
    id: '7',
    name: 'E-commerce Platform',
    description: 'Build full-featured online store with payment integration',
    status: 'active',
    progress: 34,
    dueDate: 'Due Feb 14, 2026',
    teamMembers: [
      { id: '16', name: 'Emily Park', initials: 'EP', color: 'bg-fuchsia-500' },
      { id: '17', name: 'George Hall', initials: 'GH', color: 'bg-yellow-500' }
    ],
    tags: ['E-commerce', 'Full Stack']
  },
  {
    id: '8',
    name: 'Security Audit',
    description: 'Comprehensive security review and vulnerability fixes',
    status: 'completed',
    progress: 100,
    dueDate: 'Completed Nov 5, 2025',
    teamMembers: [
      { id: '18', name: 'Quinn Roberts', initials: 'QR', color: 'bg-red-500' },
      { id: '19', name: 'Will Scott', initials: 'WS', color: 'bg-blue-500' },
      { id: '20', name: 'Xavier Turner', initials: 'XT', color: 'bg-green-500' }
    ],
    tags: ['Security', 'DevOps', 'High Priority']
  }
]

export default function ProjectsPage() {
  // Calculate stats
  const totalProjects = mockProjects.length
  const activeProjects = mockProjects.filter((p) => p.status === 'active').length
  const completedProjects = mockProjects.filter((p) => p.status === 'completed').length

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-semibold text-zinc-50">Projects</h1>
          <Button className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 gap-2">
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
      <ProjectFilters />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
}
