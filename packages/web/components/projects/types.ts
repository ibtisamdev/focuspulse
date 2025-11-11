export type ProjectStatus = 'active' | 'on-hold' | 'completed'

export interface TeamMember {
  id: string
  name: string
  initials: string
  color: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  dueDate: string
  teamMembers: TeamMember[]
  tags: string[]
}
