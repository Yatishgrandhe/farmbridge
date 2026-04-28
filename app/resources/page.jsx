import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ResourceSubmissionForm } from '@/components/resources/ResourceSubmissionForm'
import { ResourcesDirectory } from '@/components/resources/ResourcesDirectory'
import styles from './resources.module.css'

export default async function ResourcesPage() {
  const supabase = await createServerClient()

  const [{ count }, { data: resources }, { data: counties }] = await Promise.all([
    supabase.from('resource_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*').order('name'),
    supabase.from('counties').select('fips_code, name').order('name'),
  ])

  const countyRows = counties ?? []

  return (
    <main className={styles.page}>
      <section className={`${styles.topBanner} animate-on-scroll`}>
        <div className={styles.bannerInner}>
          <p className={styles.bannerEyebrow}>RESOURCE HUNTER</p>
          <h1 className={styles.bannerHeading}>Resources That Save Filing Time.</h1>
          <p className={styles.bannerSubtext}>
            Database currently tracks <span className={styles.countNumber}>{count ?? 0}</span> community submissions for
            review, plus <span className={styles.countNumber}>{resources?.length ?? 0}</span> verified offices below.
          </p>
          <p className={styles.toolkitCue}>
            <Link href="/toolkit" className={styles.toolkitLink}>
              Open operational toolkit →
            </Link>
            <span className={styles.toolkitHint}> Checklists, filing workflow, and trusted agency links.</span>
          </p>
        </div>
      </section>

      <ResourcesDirectory resources={resources ?? []} counties={countyRows} />

      <div className={styles.contentGrid}>
        <section className={`${styles.officeCard} animate-on-scroll`}>
          <div className={styles.officeIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className={styles.officeContent}>
            <p className="label">WEEKLY OFFICE HOURS</p>
            <p className="body-md">Join guided sessions for federal and state filing prep, document review, and county-level support handoff.</p>
            <Link href="/support" className={styles.primaryButton}>
              JOIN SESSION
            </Link>
          </div>
        </section>

        <div className={styles.guidanceGrid}>
          <article className={`${styles.guideCard} animate-on-scroll`}>
            <div className={styles.guideIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3>Run Eligibility</h3>
            <p className="body-sm">Cross-reference county, operation profile, and risk factors against active relief programs.</p>
            <Link href="/eligibility" className={styles.secondaryButton}>
              START
            </Link>
          </article>

          <article className={`${styles.guideCard} animate-on-scroll`}>
            <div className={styles.guideIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Contact Support</h3>
            <p className="body-sm">Resolve paperwork blockers quickly with volunteer guidance and filing-ready checklists.</p>
            <Link href="/support" className={styles.secondaryButton}>
              OPEN SUPPORT
            </Link>
          </article>
        </div>

        <section className={`${styles.submitCard} animate-on-scroll`} id="submit-resource">
          <div className={styles.submitHeader}>
            <h2 className="display-md">Submit a Resource</h2>
            <p className="body-md">Help other farmers by sharing local relief programs or support organizations.</p>
          </div>
          <ResourceSubmissionForm />
        </section>
      </div>
    </main>
  )
}
