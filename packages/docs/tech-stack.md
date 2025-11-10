# FocusPulse Tech Stack

This document outlines the technical decisions and architecture patterns for the FocusPulse MVP.

## Core Stack

### Frontend & Backend
- **Framework**: Next.js 16 with App Router
- **React Version**: React 19
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS 4

### Database
- **Provider**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma (recommended) or Drizzle
- **Connection**: Neon's built-in connection pooling for serverless

### Authentication
- **Provider**: Clerk
- **Features**: Email/password, password reset, email verification
- **Session Management**: Clerk handles sessions automatically

### Deployment
- **Platform**: Vercel
- **Domain**: focuspulse.app
- **CI/CD**: Automatic deployments via GitHub integration

### Additional Services
- **Email**: Resend (recommended for transactional emails)
- **Error Tracking**: Vercel logs (built-in) or Sentry
- **Analytics**: Vercel Analytics (optional)

---

## Architecture Patterns

### Server-First Architecture
FocusPulse uses a **server-first architecture** with Next.js Server Components and Server Actions:

- **No API Routes**: All backend logic uses Server Actions
- **Server Components**: Default rendering strategy
- **Client Components**: Only when interactivity is needed (timer, forms with client state)

### Why Server Actions?
1. **Type Safety**: End-to-end TypeScript without API contracts
2. **Simplified Data Flow**: Direct function calls from client to server
3. **Less Boilerplate**: No need to create separate API endpoints
4. **Better Performance**: Automatic optimizations by Next.js
5. **Progressive Enhancement**: Forms work without JavaScript

---

## Project Structure

### Folder Organization for @focuspulse/web

```
packages/web/
├── app/
│   ├── (auth)/              # Auth-related pages (login, signup)
│   │   ├── login/
│   │   └── sign-up/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard (streak, today's sessions)
│   │   ├── plan/            # Weekly planner
│   │   ├── session/         # Active timer view
│   │   ├── history/         # Session history & stats
│   │   └── settings/        # User settings
│   ├── actions/             # Server Actions (grouped by feature)
│   │   ├── sessions.ts      # Session CRUD operations
│   │   ├── plans.ts         # Weekly planner operations
│   │   ├── stats.ts         # Statistics and streak calculations
│   │   └── user.ts          # User profile operations
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components (buttons, cards)
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── timer/           # Timer components
│   │   └── calendar/        # Calendar/planner components
│   ├── lib/                 # Utilities and helpers
│   │   ├── db.ts            # Prisma client instance
│   │   ├── utils.ts         # Shared utilities
│   │   └── validations.ts   # Zod schemas for validation
│   └── layout.tsx           # Root layout
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

---

## Development Patterns

### Server Actions

All database operations are performed through Server Actions. Example:

```typescript
// app/actions/sessions.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createSession(title: string, duration: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const session = await db.session.create({
    data: {
      userId,
      title,
      duration,
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60000),
    }
  })

  revalidatePath('/dashboard')
  return session
}
```

### Server Components (Default)

Most pages are Server Components that fetch data directly:

```typescript
// app/(dashboard)/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { StreakDisplay } from '@/components/dashboard/streak-display'

export default async function DashboardPage() {
  const { userId } = await auth()

  const sessions = await db.session.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' },
    take: 10,
  })

  return (
    <div>
      <StreakDisplay sessions={sessions} />
      {/* More components */}
    </div>
  )
}
```

### Client Components (When Needed)

Use Client Components for interactive features:

```typescript
// app/components/timer/active-timer.tsx
'use client'

import { useState, useEffect } from 'react'

export function ActiveTimer() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div>{formatTime(elapsed)}</div>
}
```

---

## Database Schema

### Core Tables

**users** (managed by Clerk, reference via userId)
- Clerk handles all user data, we only store the userId

**sessions**
- id (UUID, primary key)
- userId (string, references Clerk user)
- title (string)
- startTime (timestamp)
- endTime (timestamp)
- duration (integer, minutes)
- notes (text, nullable)
- isPlanned (boolean)
- isCompleted (boolean)
- createdAt (timestamp)

**planned_blocks**
- id (UUID, primary key)
- userId (string)
- dayOfWeek (integer, 0-6)
- startTime (time)
- duration (integer, minutes)
- title (string)
- isRecurring (boolean)
- isActive (boolean)
- createdAt (timestamp)

**user_settings**
- id (UUID, primary key)
- userId (string, unique)
- weeklyGoalHours (integer, default: 12)
- defaultSessionDuration (integer, default: 90)
- updatedAt (timestamp)

### Indexes
- sessions: userId, startTime, isCompleted
- planned_blocks: userId, dayOfWeek, isActive

---

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://..."  # Neon connection string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Email (Resend)
RESEND_API_KEY="re_..."

# Optional: Error Tracking
SENTRY_DSN="..."
```

### Local Development

Create `.env.local` in `packages/web/` with the above variables. Never commit this file.

---

## Authentication Flow with Clerk

### Setup
1. Install: `bun add @clerk/nextjs`
2. Wrap app with `<ClerkProvider>` in layout.tsx
3. Use middleware to protect routes

### Protecting Routes

```typescript
// packages/web/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/login(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### Getting User in Server Components

```typescript
import { auth } from '@clerk/nextjs/server'

const { userId } = await auth()
if (!userId) redirect('/login')
```

---

## Database Operations with Prisma

### Setup
1. Install: `bun add prisma @prisma/client`
2. Init: `bunx prisma init`
3. Define schema in `prisma/schema.prisma`
4. Run migrations: `bunx prisma migrate dev`

### Prisma Client Singleton

```typescript
// packages/web/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Usage in Server Actions

```typescript
import { db } from '@/lib/db'

const sessions = await db.session.findMany({
  where: { userId },
  orderBy: { startTime: 'desc' },
})
```

---

## Email with Resend

### Setup
1. Install: `bun add resend`
2. Add API key to `.env.local`
3. Create email templates in `lib/emails/`

### Sending Emails

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: 'FocusPulse <hello@focuspulse.app>',
    to: email,
    subject: 'Welcome to FocusPulse!',
    html: `<p>Hi ${name}, welcome to FocusPulse!</p>`,
  })
}
```

---

## Validation with Zod

Use Zod for input validation in Server Actions:

```typescript
// lib/validations.ts
import { z } from 'zod'

export const createSessionSchema = z.object({
  title: z.string().min(1).max(100),
  duration: z.number().min(1).max(480), // Max 8 hours
  notes: z.string().max(1000).optional(),
})

// Usage in Server Action
export async function createSession(formData: FormData) {
  const data = createSessionSchema.parse({
    title: formData.get('title'),
    duration: Number(formData.get('duration')),
  })
  // ... rest of logic
}
```

---

## Testing Strategy

### Unit Tests
- **Tool**: Vitest (already configured in monorepo)
- **Focus**: Utility functions, validation logic, streak calculations

### Integration Tests
- **Tool**: Playwright
- **Focus**: Critical user flows (signup, start session, view streak)

### Testing Server Actions
Use `@testing-library/react` for component tests that call Server Actions.

---

## Performance Optimization

### Server Components by Default
- Reduce JavaScript bundle size
- Faster initial page loads
- Better SEO

### Streaming & Suspense
Use React Suspense for loading states:

```typescript
<Suspense fallback={<Skeleton />}>
  <SessionHistory />
</Suspense>
```

### Database Query Optimization
- Use Prisma's `select` to fetch only needed fields
- Implement pagination for history views
- Add appropriate indexes

### Caching Strategy
- Use Next.js cache tags with `revalidatePath()` and `revalidateTag()`
- Cache static pages where possible
- Use Vercel's Edge Cache for API responses

---

## Deployment Checklist

### Vercel Setup
1. Connect GitHub repository
2. Select `packages/web` as root directory
3. Add environment variables in Vercel dashboard
4. Enable automatic deployments

### Database Setup (Neon)
1. Create project at neon.tech
2. Copy connection string to Vercel env vars
3. Run migrations: `bunx prisma migrate deploy`

### Clerk Setup
1. Create application at clerk.com
2. Configure allowed domains (focuspulse.app)
3. Add API keys to Vercel

### Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records
3. Wait for SSL certificate

---

## Future Considerations

### Potential Additions
- **Monitoring**: Sentry or LogRocket for error tracking
- **Analytics**: PostHog or Mixpanel for product analytics
- **Payments**: Stripe for premium features (Phase 2+)
- **Real-time**: Pusher or Supabase Realtime for live updates
- **Storage**: Vercel Blob for file uploads (if needed)

### Scalability
- Neon autoscaling handles database growth
- Vercel Edge Functions for global low latency
- Consider Redis for session caching if needed
- Implement rate limiting for Server Actions

---

## Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma Guides](https://www.prisma.io/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Server Actions Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
