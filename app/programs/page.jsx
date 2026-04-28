import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { ProgramsPageClient } from '@/components/programs/ProgramsPageClient'
import styles from './programs.module.css'

function ProgramsFallback() {
  return (
    <main className={styles.page}>
      <p className={styles.loadingFallback}>Loading programs…</p>
    </main>
  )
}

export default async function Page() {
  const supabase = await createServerClient()
  const { data: programs } = await supabase.from('programs').select('*').eq('active', true).order('name')

  return (
    <Suspense fallback={<ProgramsFallback />}>
      <ProgramsPageClient programs={programs ?? []} />
    </Suspense>
  )
}
