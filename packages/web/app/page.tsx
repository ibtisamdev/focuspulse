import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  Calendar,
  Timer,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  BarChart3,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">FocusPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Why FocusPulse
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-8 py-24 md:py-32 lg:py-40">
        <Badge variant="secondary" className="text-sm">
          <Zap className="mr-1 h-3 w-3" />
          Launch Week - November 2025
        </Badge>

        <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
            Build an unbreakable
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              deep work habit
            </span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Plan your deep work sessions, track your progress, and maintain your streak.
            FocusPulse helps professionals build consistent focus habits without the feature bloat.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              Start Building Your Streak
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Multi-device sync</span>
          </div>
        </div>
      </section>

      <Separator className="container" />

      {/* Problem Statement Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-[800px] text-center">
          <Badge variant="outline" className="mb-4">The Problem</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
            Deep work is hard to maintain
          </h2>
          <div className="grid gap-6 md:grid-cols-2 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Reactive Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Most tools only let you log time after the fact, missing the planning phase that drives consistency.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  Feature Overload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Productivity apps become distracting themselves with endless settings and complex workflows.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  No Accountability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Without daily motivation and visible progress, it's easy to break your focus routine.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  No Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You don't know when you're most productive or how to optimize your focus time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="container" />

      {/* Features Section */}
      <section id="features" className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-16">
          <Badge variant="outline">Core Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Everything you need to build focus
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Simple, powerful features designed specifically for deep work. No fluff, just what matters.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {/* Feature 1: Streak Tracking */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <Badge variant="secondary">Motivation</Badge>
              </div>
              <CardTitle className="text-2xl">Streak Tracking</CardTitle>
              <CardDescription className="text-base">
                See your streak grow every day you complete a deep work session. Visual motivation that keeps you accountable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Daily streak counter with fire icon
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Calendar heatmap showing your consistency
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Track your longest streak ever
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 2: Weekly Planner */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <Badge variant="secondary">Planning</Badge>
              </div>
              <CardTitle className="text-2xl">Weekly Planner</CardTitle>
              <CardDescription className="text-base">
                Plan your deep work blocks in advance. Proactive scheduling leads to better follow-through and consistency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Visual weekly calendar view
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Click and drag to create sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Set recurring deep work blocks
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 3: Focus Timer */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-3xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Timer className="h-6 w-6 text-green-500" />
                </div>
                <Badge variant="secondary">Focus</Badge>
              </div>
              <CardTitle className="text-2xl">Active Session Timer</CardTitle>
              <CardDescription className="text-base">
                Clean, distraction-free timer interface. Track your deep work in real-time with a simple, focused view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Full-screen timer mode
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Add session notes when done
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Start planned or ad-hoc sessions
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feature 4: Analytics */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <Badge variant="secondary">Insights</Badge>
              </div>
              <CardTitle className="text-2xl">Session History & Stats</CardTitle>
              <CardDescription className="text-base">
                Understand your productivity patterns. See when you're most productive and track your progress over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Complete session history with notes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Weekly and monthly trends
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Identify your most productive times
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="container" />

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-24 md:py-32 bg-muted/30">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-16">
          <Badge variant="outline">Simple Process</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Start in 3 easy steps
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            From signup to your first deep work session in under 2 minutes.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-bold">Plan Your Week</h3>
            <p className="text-muted-foreground">
              Schedule your deep work blocks for the week ahead. Set aside time for your most important work.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-bold">Start Your Session</h3>
            <p className="text-muted-foreground">
              When it's time, click start and enter focus mode. The timer tracks your progress in real-time.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-bold">Build Your Streak</h3>
            <p className="text-muted-foreground">
              Complete at least one session per day to maintain your streak. Watch your consistency grow over time.
            </p>
          </div>
        </div>
      </section>

      <Separator className="container" />

      {/* Stats/Social Proof Section */}
      <section id="stats" className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-16">
          <Badge variant="outline">Built for Knowledge Workers</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Who FocusPulse helps
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 rounded-full bg-blue-500/10 w-fit">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Developers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build coding sessions into your routine and protect your flow state.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 rounded-full bg-purple-500/10 w-fit">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Writers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a consistent writing practice and track your daily word count goals.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 rounded-full bg-green-500/10 w-fit">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Freelancers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your time effectively and show clients your dedicated focus hours.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 rounded-full bg-orange-500/10 w-fit">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build study habits and track your progress on long-term projects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="container" />

      {/* Final CTA Section */}
      <section className="container py-24 md:py-32">
        <Card className="relative overflow-hidden border-2">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10" />
          <CardHeader className="text-center space-y-6 pb-8 pt-12">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <CardTitle className="text-4xl md:text-5xl">
                Start your streak today
              </CardTitle>
            </div>
            <CardDescription className="text-lg max-w-[600px] mx-auto">
              Join professionals who are building unbreakable deep work habits.
              Free to start, no credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-12">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Launch week special: Early users get lifetime access to premium features
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold">FocusPulse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Build an unbreakable deep work habit. Plan, track, and maintain your focus streak.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="/sign-up" className="hover:text-foreground transition-colors">
                Get Started
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <Separator className="container my-8" />

        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 FocusPulse. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              LinkedIn
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
