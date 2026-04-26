import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './programs.module.css'

const CATEGORY_TABS = ['All', '🚨 Disaster Relief', '🌱 Conservation', '💰 Loans', '🌽 Commodity Support', '💙 Mental Health', '🌾 Young Farmers']

export default async function ProgramsPage({ searchParams }) {
  const supabase = await createServerClient()
  const category = typeof searchParams?.category === 'string' ? searchParams.category : 'all'

  let query = supabase.from('programs').select('*').eq('active', true)
  if (category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: programs } = await query.order('is_urgent', { ascending: false }).order('name')
  const all = programs ?? []
  const urgent = all.filter((p) => p.is_urgent)
  const standard = all.filter((p) => !p.is_urgent)

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <section className={`${styles.container} animate-on-scroll`}>
        <header className={styles.header}>
          <p className={`${styles.headerSpan} label`}>Federal & State Programs</p>
          <h1 className={styles.headerTitle}>Relief Programs for NC Farmers.</h1>
          <p className={styles.headerText}>Many go unused because farmers do not know they exist.</p>
        </header>

        <div className={styles.filterList}>
          {CATEGORY_TABS.map((tab) => (
            <Link
              key={tab}
              href={tab === 'All' ? '/programs' : `/programs?category=${encodeURIComponent(tab.replace(/^..\s/, '').toLowerCase())}`}
              className={`${styles.filterItem} ${tab === 'All' || category === tab.replace(/^..\s/, '').toLowerCase() ? styles.filterItemActive : styles.filterItemInactive}`}
            >
              {tab}
            </Link>
          ))}
        </div>

        {urgent.length > 0 && (
          <section className={`${styles.urgentSection} animate-on-scroll`}>
            <h2 className={styles.urgentTitle}><span className={styles.urgentDotContainer}><span className={styles.urgentDotPulse} /><span className={styles.urgentDotMain} /></span>Time-Sensitive - Act Now</h2>
            <div className={styles.urgentGrid}>
              {urgent.map((program) => (
                <ProgramCard key={program.id} program={program} urgent />
              ))}
            </div>
          </section>
        )}

        <section className="animate-on-scroll">
          <h2 className={`${styles.urgentTitle}`} style={{ color: 'var(--color-mist)' }}>Open Programs</h2>
          {standard.length > 0 ? (
            <div className={styles.mainGrid}>
              {standard.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No open programs in this filter.</p>
              <p className={styles.emptyText}>Try switching categories above.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
