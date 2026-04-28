import Link from 'next/link'
import { notFound } from 'next/navigation'

import { createServerClient } from '@/lib/supabase/server'

import styles from './program-detail.module.css'

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: program } = await supabase.from('programs').select('*').eq('slug', slug).maybeSingle()

  if (!program || program.active === false) {
    notFound()
  }

  const rules = program.eligibility_rules && typeof program.eligibility_rules === 'object' ? program.eligibility_rules : null

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/programs" className={styles.backLink}>
          ← Back to programs
        </Link>

        <header className={styles.header}>
          <div className={styles.badgeGroup}>
            <span className={styles.badge}>{program.category.replace(/_/g, ' ')}</span>
            {program.is_urgent ? <span className={`${styles.badge} ${styles.urgentBadge}`}>Urgent</span> : null}
          </div>
          <h1 className={styles.title}>
            {program.name}
            {program.acronym ? ` (${program.acronym})` : ''}
          </h1>
          <p className={styles.summary}>{program.summary}</p>
        </header>

        <div className={styles.contentGrid}>
          <div className={styles.mainSection}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Overview</h2>
              <p className={styles.description}>{program.description}</p>
            </section>

            {program.how_to_apply ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>How to apply</h2>
                <p className={styles.description}>{program.how_to_apply}</p>
              </section>
            ) : null}

            {rules ? (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Eligibility highlights</h2>
                <div className={styles.ruleList}>
                  {Object.entries(rules as Record<string, unknown>).map(([key, val]) => (
                    <div key={key} className={styles.ruleCard}>
                      <div className={styles.ruleLabel}>{key.replace(/_/g, ' ')}</div>
                      <div className={styles.ruleValue}>
                        {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.factsCard}>
              <h3 className={styles.factsTitle}>Program facts</h3>
              <div className={styles.factsList}>
                <div className={styles.factItem}>
                  <span className={styles.factLabel}>Agency</span>
                  <span className={styles.factValue}>{program.agency}</span>
                </div>
                {program.deadline_label ? (
                  <div className={styles.factItem}>
                    <span className={styles.factLabel}>Deadline</span>
                    <span className={styles.factValue}>{program.deadline_label}</span>
                  </div>
                ) : null}
                {program.funding_amount ? (
                  <div className={styles.factItem}>
                    <span className={styles.factLabel}>Funding</span>
                    <span className={`${styles.fundingValue}`}>{program.funding_amount}</span>
                  </div>
                ) : null}
              </div>
              {program.apply_url ? (
                <a href={program.apply_url} className={styles.applyButton} target="_blank" rel="noopener noreferrer">
                  Apply or learn more
                </a>
              ) : null}
              {program.phone_number ? (
                <p className={styles.description} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                  Phone: {program.phone_number}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
