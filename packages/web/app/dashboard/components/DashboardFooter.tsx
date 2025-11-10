import Link from 'next/link'

export function DashboardFooter() {
  return (
    <footer className="border-t border-zinc-800 mt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <p>© 2025 FocusPulse. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-zinc-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
