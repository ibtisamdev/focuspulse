import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Custom minimal SVG components
const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CalendarSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="80" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <line x1="20" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="1.5" />
    <line x1="35" y1="25" x2="35" y2="35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="85" y1="25" x2="85" y2="35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="40" cy="60" r="2" fill="currentColor" />
    <circle cx="60" cy="60" r="2" fill="currentColor" />
    <circle cx="80" cy="60" r="2" fill="currentColor" />
    <circle cx="40" cy="75" r="2" fill="currentColor" />
    <circle cx="60" cy="75" r="2" fill="currentColor" />
    <circle cx="80" cy="75" r="2" fill="currentColor" />
  </svg>
)

const TimerSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="65" r="35" stroke="currentColor" strokeWidth="1.5" />
    <path d="M60 40V65L75 75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="45" y1="25" x2="75" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChartSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="70" width="12" height="30" stroke="currentColor" strokeWidth="1.5" />
    <rect x="54" y="50" width="12" height="50" stroke="currentColor" strokeWidth="1.5" />
    <rect x="78" y="40" width="12" height="60" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const FocusSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="60" cy="60" r="3" fill="currentColor" />
  </svg>
)

// Background SVG patterns - Highly visible and creative
const GridBackground = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <circle cx="0" cy="0" r="2" fill="rgba(255,255,255,0.15)" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Top right geometric shape */}
    <svg className="absolute -top-40 -right-40 w-[500px] h-[500px]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M250 50 L400 150 L350 300 L150 350 L100 200 Z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
      <circle cx="250" cy="250" r="120" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <rect x="180" y="180" width="140" height="140" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" transform="rotate(45 250 250)" />
    </svg>

    {/* Bottom left abstract waves */}
    <svg className="absolute -bottom-32 -left-32 w-[600px] h-[400px]" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 200 Q150 100 300 200 T600 200" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
      <path d="M0 240 Q150 140 300 240 T600 240" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <path d="M0 280 Q150 180 300 280 T600 280" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    </svg>

    {/* Center floating circles */}
    <svg className="absolute top-1/3 left-1/4 w-[300px] h-[300px]" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="80" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="150" cy="150" r="120" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>

    {/* Right side vertical lines pattern */}
    <svg className="absolute top-1/4 right-20 w-[200px] h-[600px]" viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="0" x2="50" y2="600" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
      <line x1="100" y1="100" x2="100" y2="500" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <line x1="150" y1="50" x2="150" y2="550" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    </svg>
  </div>
)

const FocusRings = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large focus rings - symbolizing concentration */}
    <svg className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[800px] h-[800px]" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="400" cy="400" r="150" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
      <circle cx="400" cy="400" r="200" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
      <circle cx="400" cy="400" r="250" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <circle cx="400" cy="400" r="300" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="400" cy="400" r="350" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  </div>
)

const TimerArcs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Timer/clock inspired arcs */}
    <svg className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-[600px] h-[600px]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 300 100 A 200 200 0 0 1 500 300" stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 500 300 A 200 200 0 0 1 300 500" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 300 500 A 200 200 0 0 1 100 300" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 100 300 A 200 200 0 0 1 300 100" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="300" cy="300" r="10" fill="rgba(255,255,255,0.5)" />
    </svg>
  </div>
)

const GeometricPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Abstract geometric pattern */}
    <svg className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[400px] h-[500px]" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="200,50 350,150 300,300 100,280 80,120" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" />
      <polygon points="150,100 280,180 250,320 120,300 90,160" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
      <line x1="200" y1="50" x2="200" y2="250" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="100" y1="180" x2="300" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
  </div>
)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Background patterns - layered for depth */}
      <GridBackground />
      <FloatingShapes />

      {/* Navigation */}
      <nav className="border-b border-zinc-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoIcon />
              <span className="text-lg font-medium text-zinc-50">FocusPulse</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50 hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 h-9 px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-medium text-zinc-50 mb-6 tracking-tight">
            Build a deep work habit
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plan your sessions, track your time, and maintain your streak.
            A simple tool for consistent focus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 h-11 px-6 text-base">
                Start free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50 hover:bg-transparent h-11 px-6 text-base">
                View demo
                <span className="ml-2"><ArrowRightIcon /></span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="px-6 pb-24 md:pb-32 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="border border-zinc-900 rounded-lg p-8 bg-black/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-medium text-zinc-50 mb-2">15</div>
                <div className="text-sm text-zinc-500">Day streak</div>
              </div>
              <div className="border-l border-r border-zinc-900">
                <div className="text-4xl font-medium text-zinc-50 mb-2">24.5h</div>
                <div className="text-sm text-zinc-500">This week</div>
              </div>
              <div>
                <div className="text-4xl font-medium text-zinc-50 mb-2">127</div>
                <div className="text-sm text-zinc-500">Total sessions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-24 md:py-32 border-t border-zinc-900 relative">
        <GeometricPattern />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium text-zinc-50 mb-16 text-center">
            Why deep work is hard
          </h2>
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                1
              </div>
              <div>
                <h3 className="text-xl font-medium text-zinc-50 mb-2">No planning</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Most people react to their day instead of planning it. Without scheduled deep work blocks, focus time never happens.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                2
              </div>
              <div>
                <h3 className="text-xl font-medium text-zinc-50 mb-2">No accountability</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Without tracking your consistency, it's easy to skip sessions. A visual streak keeps you honest.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                3
              </div>
              <div>
                <h3 className="text-xl font-medium text-zinc-50 mb-2">Complex tools</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Productivity apps have too many features. You need something simple that gets out of your way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 md:py-32 border-t border-zinc-900 relative overflow-hidden">
        <FocusRings />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium text-zinc-50 mb-16 text-center">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="text-center">
              <div className="mb-6 text-zinc-400 inline-block">
                <CalendarSVG />
              </div>
              <h3 className="text-xl font-medium text-zinc-50 mb-3">Weekly planner</h3>
              <p className="text-zinc-400 leading-relaxed">
                Schedule your deep work blocks in advance. See your week at a glance and plan around your most productive hours.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 text-zinc-400 inline-block">
                <TimerSVG />
              </div>
              <h3 className="text-xl font-medium text-zinc-50 mb-3">Focus timer</h3>
              <p className="text-zinc-400 leading-relaxed">
                Start a session and enter distraction-free mode. The timer counts up while you work without interruption.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 text-zinc-400 inline-block">
                <ChartSVG />
              </div>
              <h3 className="text-xl font-medium text-zinc-50 mb-3">Progress tracking</h3>
              <p className="text-zinc-400 leading-relaxed">
                See your daily streak, weekly hours, and long-term trends. Understand your patterns and stay motivated.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6 text-zinc-400 inline-block">
                <FocusSVG />
              </div>
              <h3 className="text-xl font-medium text-zinc-50 mb-3">Session history</h3>
              <p className="text-zinc-400 leading-relaxed">
                Review past sessions with notes about what you accomplished. Learn when you're most productive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 md:py-32 border-t border-zinc-900 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium text-zinc-50 mb-16 text-center">
            How it works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                1
              </div>
              <div>
                <p className="text-zinc-300">
                  <span className="text-zinc-50 font-medium">Plan your week.</span> Open the planner and schedule when you'll do deep work.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                2
              </div>
              <div>
                <p className="text-zinc-300">
                  <span className="text-zinc-50 font-medium">Start your session.</span> When it's time, click to begin and enter focus mode.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                3
              </div>
              <div>
                <p className="text-zinc-300">
                  <span className="text-zinc-50 font-medium">Build your streak.</span> Complete sessions daily to maintain your momentum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="px-6 py-24 md:py-32 border-t border-zinc-900 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium text-zinc-50 mb-8">
            Built for knowledge workers
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Developers, writers, designers, researchers — anyone who needs extended periods of focused, uninterrupted work.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-24 md:py-32 border-t border-zinc-900 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-medium text-zinc-50 mb-2">10,000+</div>
              <div className="text-sm text-zinc-500">Sessions completed</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-zinc-50 mb-2">85 min</div>
              <div className="text-sm text-zinc-500">Average session</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-zinc-50 mb-2">92%</div>
              <div className="text-sm text-zinc-500">Report better consistency</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 md:py-32 border-t border-zinc-900 relative overflow-hidden">
        <TimerArcs />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-medium text-zinc-50 mb-6">
            Start building your habit
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            Free to start. No credit card required.
          </p>
          <Link href="/sign-up">
            <Button className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 h-11 px-8 text-base">
              Get started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LogoIcon />
                <span className="text-base font-medium text-zinc-50">FocusPulse</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-xs">
                Build consistent deep work habits.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <h3 className="text-sm font-medium text-zinc-50 mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-50">Features</Link></li>
                  <li><Link href="/dashboard/planner" className="text-sm text-zinc-500 hover:text-zinc-50">Planner</Link></li>
                  <li><Link href="/dashboard/session" className="text-sm text-zinc-500 hover:text-zinc-50">Timer</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-50 mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-50">Privacy</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 hover:text-zinc-50">Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-900 mt-12 pt-8">
            <p className="text-sm text-zinc-600 text-center">
              © 2025 FocusPulse
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
