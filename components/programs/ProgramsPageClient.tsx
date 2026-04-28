'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Database } from '@/lib/types/database.types'
import { ProgramCard } from '@/components/ui/ProgramCard'
import styles from '@/app/programs/programs.module.css'

type Program = Database['public']['Tables']['programs']['Row']

function categoryLabel(cat: string) {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ProgramsPageClient({ programs }: { programs: Program[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCategory = searchParams.get('category')

  const categories = useMemo(() => {
    const unique = Array.from(new Set(programs.map((p) => p.category))).sort()
    return ['ALL', ...unique]
  }, [programs])

  const activeCategory =
    rawCategory && categories.includes(rawCategory) ? rawCategory : 'ALL'

  const filteredPrograms = useMemo(() => {
    if (activeCategory === 'ALL') return programs
    return programs.filter((p) => p.category === activeCategory)
  }, [programs, activeCategory])

  const urgentCount = useMemo(() => programs.filter((p) => p.is_urgent).length, [programs])

  const lastUpdated = useMemo(() => {
    let max = 0
    for (const p of programs) {
      const t = p.updated_at ? new Date(p.updated_at).getTime() : 0
      if (t > max) max = t
    }
    return max
      ? new Date(max).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A'
  }, [programs])

  function setCategory(cat: string) {
    if (cat === 'ALL') {
      router.push('/programs')
      return
    }
    router.push(`/programs?category=${encodeURIComponent(cat)}`)
  }

  return (
    <main className={styles.page}>
      <header className={`${styles.header} animate-on-scroll`}>
        <div className={styles.headerTop}>
          <p className="label">NORTH CAROLINA · VOL 24</p>
          <p className="label">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className={styles.headerMain}>
          <h1 className="display-xl">The Program Index</h1>
          <p className="body-lg">
            Active operational relief and disaster assistance files for the 2026 response window.
          </p>
        </div>
        <div className={styles.headerBottom}>
          <div className={styles.matrix}>
            <div className={styles.matrixItem}>
              <span className={styles.matrixLabel}>ACTIVE FILES</span>
              <span className={styles.matrixValue}>{programs.length}</span>
            </div>
            <div className={styles.matrixItem}>
              <span className={styles.matrixLabel}>TIME CRITICAL</span>
              <span className={styles.matrixValue}>{urgentCount}</span>
            </div>
            <div className={styles.matrixItem}>
              <span className={styles.matrixLabel}>LAST UPDATED</span>
              <span className={styles.matrixValue}>{lastUpdated}</span>
            </div>
          </div>
        </div>
      </header>

      <section className={`${styles.filterSection} animate-on-scroll`}>
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'ALL' ? 'ALL' : categoryLabel(cat)}
            </button>
          ))}
        </div>
      </section>

      <section className={`${styles.gridSection} animate-on-scroll`}>
        <div className={styles.grid}>
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              urgent={Boolean(program.is_urgent)}
              style={{ height: '100%', minHeight: '280px' }}
            />
          ))}
        </div>
        {filteredPrograms.length === 0 && (
          <p className={styles.emptyState}>No programs in this category yet.</p>
        )}
      </section>

      <section className={`${styles.supportSection} animate-on-scroll`}>
        <div className={styles.supportBox}>
          <h2 className="display-md">Can&apos;t find what you need?</h2>
          <p className="body-md">
            Our operational support team can help you navigate state and federal programs in the FarmBridge database.
          </p>
          <Link href="/support" className={styles.supportBtn}>
            CONNECT WITH AN AGENT
          </Link>
        </div>
      </section>
    </main>
  )
}
