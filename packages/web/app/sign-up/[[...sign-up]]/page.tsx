import { SignUp } from '@clerk/nextjs'

/**
 * Sign Up Page
 *
 * This page uses Clerk's pre-built SignUp component.
 * The [[...sign-up]] catch-all route handles all sign-up related paths.
 */

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}
