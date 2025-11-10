import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Target, Flame, TrendingUp, Clock, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 flex items-center justify-center">
                <Flame className="h-5 w-5 text-zinc-50" />
              </div>
              <span className="text-xl font-semibold text-zinc-50">FocusPulse</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-zinc-400">Built for deep work consistency</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-zinc-50 mb-6 leading-tight">
              Plan your deep work.
              <br />
              <span className="bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent">
                Build your streak.
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              FocusPulse helps professionals build a consistent deep work habit through planning,
              tracking, and streak-based motivation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 px-8 py-6 text-lg group"
                >
                  Start Building Your Streak
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 px-8 py-6 text-lg"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-800 rounded-2xl p-8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Flame className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-zinc-50">15</div>
                        <div className="text-sm text-zinc-400">Day Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-zinc-50">24.5</div>
                        <div className="text-sm text-zinc-400">Hours This Week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Target className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-zinc-50">127</div>
                        <div className="text-sm text-zinc-400">Total Sessions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
              The deep work struggle is real
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Knowledge workers face constant challenges maintaining focus and building consistent habits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">😓</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">Reactive Time Tracking</h3>
                <p className="text-zinc-400">
                  Logging time after the fact doesn&apos;t help you plan better or build consistent habits
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🤯</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">Feature Bloat</h3>
                <p className="text-zinc-400">
                  Complex productivity tools with dozens of features you never use get in the way of actual work
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">📉</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">Lack of Accountability</h3>
                <p className="text-zinc-400">
                  Without clear visibility into your progress, it&apos;s easy to lose motivation and consistency
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">No Pattern Recognition</h3>
                <p className="text-zinc-400">
                  You don&apos;t know when you&apos;re most productive or how to optimize your schedule for deep work
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
              A better way to build deep work habits
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              FocusPulse is designed around four core principles that make consistency effortless
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl" />
              <Card className="relative bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-50 mb-4">Planning-First Approach</h3>
                  <p className="text-zinc-400 mb-4">
                    Schedule your deep work blocks in advance with our intuitive weekly planner.
                    Proactive planning leads to better execution and fewer excuses.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Weekly calendar view
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Drag and drop scheduling
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Sync across all devices
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-2xl" />
              <Card className="relative bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6">
                    <Flame className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-50 mb-4">Streak-Based Motivation</h3>
                  <p className="text-zinc-400 mb-4">
                    Build an unbreakable streak by completing at least one deep work session every day.
                    Visual feedback keeps you accountable and motivated.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Daily streak tracking
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Calendar heatmap visualization
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Achievement milestones
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-2xl" />
              <Card className="relative bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-50 mb-4">Focused Simplicity</h3>
                  <p className="text-zinc-400 mb-4">
                    No feature bloat. No distractions. Just the essential tools you need to
                    plan, track, and analyze your deep work sessions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Clean, minimal interface
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Distraction-free timer
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Quick-start sessions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl blur-2xl" />
              <Card className="relative bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center mb-6">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-zinc-50 mb-4">Smart Analytics</h3>
                  <p className="text-zinc-400 mb-4">
                    Understand your productivity patterns with detailed insights. Discover your
                    best days, optimal times, and track long-term progress.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Weekly and monthly trends
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Productivity pattern analysis
                    </li>
                    <li className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Session history and notes
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
              Simple workflow, powerful results
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Getting started with FocusPulse takes less than a minute
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-8 w-px h-full bg-gradient-to-b from-zinc-800 to-transparent md:hidden" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">Plan Your Week</h3>
                <p className="text-zinc-400">
                  Open the weekly planner and schedule your deep work blocks.
                  Add titles, set durations, and arrange them when you&apos;re most productive.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-8 w-px h-full bg-gradient-to-b from-zinc-800 to-transparent md:hidden" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">Start Your Session</h3>
                <p className="text-zinc-400">
                  When it&apos;s time to work, start your planned session or begin an ad-hoc one.
                  The timer keeps you focused in a distraction-free environment.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-50 mb-3">Track & Improve</h3>
                <p className="text-zinc-400">
                  Complete your session, maintain your streak, and review your analytics.
                  Learn from your patterns and optimize your schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
              Built for knowledge workers
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              FocusPulse is designed for professionals who need to manage their own time and maintain deep focus
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">👨‍💻</div>
                <h3 className="text-lg font-semibold text-zinc-50 mb-2">Developers</h3>
                <p className="text-sm text-zinc-400">Deep coding sessions</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-lg font-semibold text-zinc-50 mb-2">Writers</h3>
                <p className="text-sm text-zinc-400">Focused writing time</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-lg font-semibold text-zinc-50 mb-2">Designers</h3>
                <p className="text-sm text-zinc-400">Creative flow sessions</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold text-zinc-50 mb-2">Researchers</h3>
                <p className="text-sm text-zinc-400">Analysis & study time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-zinc-50 mb-2">10,000+</div>
              <div className="text-zinc-400">Deep work sessions completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-zinc-50 mb-2">85 min</div>
              <div className="text-zinc-400">Average session duration</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-zinc-50 mb-2">92%</div>
              <div className="text-zinc-400">Users report better consistency</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-800 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <CardContent className="p-12 text-center relative">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
                Ready to build your streak?
              </h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                Join knowledge workers who are building consistent deep work habits with FocusPulse.
                Start your free account today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 px-8 py-6 text-lg group"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-sm text-zinc-500">No credit card required</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-zinc-50" />
                </div>
                <span className="text-lg font-semibold text-zinc-50">FocusPulse</span>
              </div>
              <p className="text-sm text-zinc-400">
                Build consistent deep work habits through planning, tracking, and streaks.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-50 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-50">Features</Link></li>
                <li><Link href="/dashboard/planner" className="text-sm text-zinc-400 hover:text-zinc-50">Planner</Link></li>
                <li><Link href="/dashboard/session" className="text-sm text-zinc-400 hover:text-zinc-50">Timer</Link></li>
                <li><Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-50">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-50 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-zinc-50">About</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-zinc-50">Blog</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-zinc-50">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-50 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-zinc-50">Privacy</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-zinc-50">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8">
            <p className="text-sm text-zinc-400 text-center">
              © 2025 FocusPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
