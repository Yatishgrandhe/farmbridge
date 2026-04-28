import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { buildHomePayload } from '@/lib/home/buildHomePayload'
import { ProgramsPageClient } from '@/components/programs/ProgramsPageClient'
import styles from './programs.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function ProgramsFallback() {
  return (
    <main className={styles.page}>
      <p className={styles.loadingFallback}>Loading programs…</p>
    </main>
  )
}

export default async function Page() {
  const supabase = await createServerClient()

  const [{ data: programs }, payload] = await Promise.all([
    supabase.from('programs').select('*').eq('active', true).order('name'),
    buildHomePayload(supabase),
  ])

  return (
    <Suspense fallback={<ProgramsFallback />}>
      <ProgramsPageClient
        programs={programs ?? []}
        counties={payload.counties}
        overlays={payload.overlays}
      />
    </Suspense>
  )
}
