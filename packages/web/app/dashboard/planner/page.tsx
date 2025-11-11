import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getPlannedBlocks } from '@/app/actions/planner'
import { PlannerClient } from './components/PlannerClient'

export default async function PlannerPage() {
  // Check authentication
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Fetch planned blocks from database
  const plannedBlocks = await getPlannedBlocks()

  return <PlannerClient initialBlocks={plannedBlocks} />
}
