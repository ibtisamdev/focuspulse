'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bell, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SessionTitleModal } from './SessionTitleModal'

export function DashboardHeader() {
  const pathname = usePathname()
  const [showTitleModal, setShowTitleModal] = useState(false)

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path
    }
    return pathname?.startsWith(path)
  }

  return (
    <nav className="border-b border-zinc-800 bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-lg font-semibold text-zinc-50">FocusPulse</div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className={cn(
                'transition-colors',
                isActive('/dashboard') ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/planner"
              className={cn(
                'transition-colors',
                isActive('/dashboard/planner') ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Planner
            </Link>
            <Link
              href="/dashboard/history"
              className={cn(
                'transition-colors',
                isActive('/dashboard/history') ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              History
            </Link>
            {/* <Link
              href="/projects"
              className={cn(
                'transition-colors',
                isActive('/projects') ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Projects
            </Link> */}
            <Link
              href="/dashboard/settings"
              className={cn(
                'transition-colors',
                isActive('/dashboard/settings') ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Settings
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Start Focus Session Button */}
          <Button
            size="sm"
            className="h-8 bg-zinc-50 text-zinc-900 hover:bg-zinc-200 text-xs font-medium gap-1.5"
            onClick={() => setShowTitleModal(true)}
          >
            <Play className="h-3.5 w-3.5 fill-zinc-900" />
            <span className="hidden sm:inline">Start Focus</span>
          </Button>
          {/* <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-zinc-800 bg-[#18181b] hover:bg-zinc-800/50"
            aria-label="Notifications"
            onClick={() => {
              // Placeholder for notifications functionality
              console.log('Notifications clicked')
            }}
          >
            <Bell className="h-4 w-4 text-zinc-400" />
          </Button> */}
          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/dashboard/settings"
            appearance={{
              elements: {
                userButtonPopoverActionButton__manageAccount: {
                  display: 'none',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Session Title Modal */}
      <SessionTitleModal open={showTitleModal} onOpenChange={setShowTitleModal} />
    </nav>
  )
}
