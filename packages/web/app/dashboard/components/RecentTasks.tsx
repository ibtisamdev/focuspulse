'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface Task {
  id: string
  title: string
  status: string
  completed: boolean
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review product requirements document',
    status: 'Completed 2h ago',
    completed: true,
  },
  {
    id: '2',
    title: 'Update dashboard mockups',
    status: 'Due in 3 hours',
    completed: false,
  },
  {
    id: '3',
    title: 'Prepare team presentation',
    status: 'Due tomorrow',
    completed: false,
  },
  {
    id: '4',
    title: 'Code review for feature branch',
    status: 'Due in 2 days',
    completed: false,
  },
]

export function RecentTasks() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  return (
    <Card className="bg-[#18181b] border-zinc-800">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-50">Recent Tasks</h2>
          <Link
            href="/dashboard/tasks"
            className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-0">
          {tasks.map((task, index) => (
            <div key={task.id}>
              <div className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-zinc-700 data-[state=checked]:bg-zinc-700 data-[state=checked]:border-zinc-700"
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-50'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{task.status}</p>
                  </div>
                </div>
              </div>
              {index < tasks.length - 1 && <Separator className="bg-zinc-800" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
