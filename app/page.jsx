import { createServerClient } from '@/lib/supabase/server'
import { buildHomePayload } from '@/lib/home/buildHomePayload'
import { HomeClient } from '@/components/home/HomeClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const supabase = await createServerClient()
  const payload = await buildHomePayload(supabase)
  return (
    <HomeClient stats={payload.stats} counties={payload.counties} overlays={payload.overlays} />
  )
}
