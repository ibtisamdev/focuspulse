'use client'

import { useState } from 'react'
import { SessionTitleModal } from './SessionTitleModal'

export function StartSessionCTA() {
  const [showTitleModal, setShowTitleModal] = useState(false)

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => setShowTitleModal(true)}
          className="w-full block bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-zinc-700 transition-all group text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-900"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-zinc-50">Start Deep Work Now</h2>
              </div>
              <p className="text-sm text-zinc-400">
                Begin a focused work session and track your progress
              </p>
            </div>
            <div className="hidden md:block">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <SessionTitleModal open={showTitleModal} onOpenChange={setShowTitleModal} />
    </>
  )
}
