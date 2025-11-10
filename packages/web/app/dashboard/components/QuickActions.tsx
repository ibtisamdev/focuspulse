'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Clock, BarChart3, Settings } from 'lucide-react'

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: 'Add New Task',
      description: 'Create a new task',
      icon: <Plus className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => console.log('Add new task clicked'),
    },
    {
      title: 'Start Timer',
      description: 'Begin focus session',
      icon: <Clock className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => console.log('Start timer clicked'),
    },
    {
      title: 'View Analytics',
      description: 'Check your stats',
      icon: <BarChart3 className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => console.log('View analytics clicked'),
    },
    {
      title: 'Settings',
      description: 'Manage preferences',
      icon: <Settings className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => console.log('Settings clicked'),
    },
  ]

  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader className="p-6 pb-4">
        <h2 className="text-lg font-semibold text-zinc-50">Quick Actions</h2>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 justify-start gap-3 border-zinc-800 hover:bg-zinc-800/50 bg-transparent"
              onClick={action.onClick}
            >
              <div className="h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                {action.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-50">{action.title}</p>
                <p className="text-xs text-zinc-500 font-normal">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
