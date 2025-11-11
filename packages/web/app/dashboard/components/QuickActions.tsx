'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ActionButton } from '@/components/ui/action-button'
import { Plus, Clock, Calendar } from 'lucide-react'
import { SessionTitleModal } from './SessionTitleModal'

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}

export function QuickActions() {
  const router = useRouter()
  const [showTitleModal, setShowTitleModal] = useState(false)

  const actions: QuickAction[] = [
    {
      title: 'Add New Task',
      description: 'Create a new task',
      icon: <Plus className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => console.log('Add new task clicked'),
    },
    {
      title: 'View Planner',
      description: 'Weekly schedule',
      icon: <Calendar className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => router.push('/dashboard/planner'),
    },
    {
      title: 'Start Timer',
      description: 'Begin focus session',
      icon: <Clock className="h-[18px] w-[18px] text-zinc-400" />,
      onClick: () => setShowTitleModal(true),
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
            <ActionButton
              key={action.title}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={action.onClick}
            />
          ))}
        </div>
      </CardContent>

      {/* Session Title Modal */}
      <SessionTitleModal open={showTitleModal} onOpenChange={setShowTitleModal} />
    </Card>
  )
}
