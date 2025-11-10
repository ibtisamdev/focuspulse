'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export function DashboardHeader() {
  return (
    <nav className="border-b border-zinc-800 bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-lg font-semibold text-zinc-50">FocusPulse</div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-zinc-50 hover:text-zinc-300 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className="text-zinc-400 hover:text-zinc-300 transition-colors">
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="text-zinc-400 hover:text-zinc-300 transition-colors">
              Settings
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
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
          </Button>
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
