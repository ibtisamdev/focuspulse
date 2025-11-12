import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

/**
 * Sign In Page
 *
 * This page uses Clerk's pre-built SignIn component.
 * The [[...sign-in]] catch-all route handles all sign-in related paths.
 */

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <SignIn appearance={{ baseTheme: dark }} />
    </div>
  )
}
