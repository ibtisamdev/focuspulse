import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

/**
 * Sign Up Page
 *
 * This page uses Clerk's pre-built SignUp component.
 * The [[...sign-up]] catch-all route handles all sign-up related paths.
 */

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <SignUp appearance={{ baseTheme: dark }} />
    </div>
  )
}
