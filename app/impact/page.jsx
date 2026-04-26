import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { DataChart } from '@/components/ui/DataChart'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './impact.module.css'

export default async function ImpactPage() {
  const supabase = await createServerClient()
  const [{ count: disasterCount }, { count: activePrograms }, { count: urgentPrograms }, { data: countyData }] = await Promise.all([
    supabase.from('counties').select('*', { count: 'exact', head: true }).eq('is_primary_disaster_area', true),
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('active', true).eq('is_urgent', true),
    supabase.from('counties').select('name,precipitation_deficit_inches').order('precipitation_deficit_inches', { ascending: false }).limit(10),
  ])

  const chartRows = (countyData ?? []).map((row) => ({ county: row.name, deficit: Number(row.precipitation_deficit_inches ?? 0) }))

  return (
    <main className={styles.container}>
      <ScrollAnimator />
      <div className={styles.inner}>
        <header className={`${styles.header} animate-on-scroll`}>
          <span className={`${styles.headerSpan} label`}>State of Emergency</span>
          <h1 className={styles.headerTitle}>Live North Carolina Impact Data.</h1>
          <p className={styles.headerText}>Metrics refresh from Supabase-backed county and program tables.</p>
        </header>

        <section className={`${styles.content} animate-on-scroll`}>
          <div className={styles.metricsGrid}>
            <article className={styles.statCard}><p className={styles.statLabel}>Primary Disaster Counties</p><p className={styles.statValue}><AnimatedCounter value={disasterCount ?? 0} /></p></article>
            <article className={styles.statCard}><p className={styles.statLabel}>Active Programs</p><p className={styles.statValue}><AnimatedCounter value={activePrograms ?? 0} /></p></article>
            <article className={styles.statCard}><p className={styles.statLabel}>Urgent Programs</p><p className={styles.statValue}><AnimatedCounter value={urgentPrograms ?? 0} /></p></article>
          </div>

          <DataChart data={chartRows} xAxisKey="county" yAxisKey="deficit" title="Top Rainfall Deficits (inches)" type="bar" height={360} color="var(--color-harvest)" />
        </section>

        <section className={`${styles.footerCard} animate-on-scroll`}>
          <h2 className={styles.footerTitle}>Convert Risk Signals into Applications</h2>
          <p className={styles.footerText}>Use the live program list to move from county risk indicators to immediate filing actions.</p>
          <Link href="/programs" className={styles.footerAction}>Open Program List</Link>
        </section>
      </div>
    </main>
  )
}
