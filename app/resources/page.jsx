import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './resources.module.css'

export default async function ResourcesPage() {
  const supabase = await createServerClient()
  const { count } = await supabase.from('resource_submissions').select('*', { count: 'exact', head: true })

  return (
    <main className={styles.page}>
      <ScrollAnimator />
      <div className={styles.bgImage} />
      
      {/* Page Header - Wide editorial masthead */}
      <section className={`${styles.header} animate-on-scroll`}>
        <div className={styles.headerContent}>
          <p className="label">RESOURCE CENTER</p>
          <h1 className="display-lg">Resources That Save Filing Time.</h1>
          <p className="body-sm">
            Database currently tracks <span className={styles.countNumber}>{count ?? 0}</span> local resource records
          </p>
        </div>
      </section>

      <div className={styles.contentGrid}>
        {/* Office Hours Card */}
        <section className={`${styles.officeCard} animate-on-scroll`}>
          <div className={styles.officeIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className={styles.officeContent}>
            <p className="label">WEEKLY OFFICE HOURS</p>
            <p className="body-md">Join guided sessions for federal and state filing prep, document review, and county-level support handoff.</p>
            <Link href="/support" className={styles.primaryButton}>JOIN SESSION</Link>
          </div>
        </section>

        {/* Guidance CTA Block */}
        <div className={styles.guidanceGrid}>
          <article className={`${styles.guideCard} animate-on-scroll`}>
            <div className={styles.guideIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>Run Eligibility</h3>
            <p className="body-sm">Cross-reference county, operation profile, and risk factors against active relief programs.</p>
            <Link href="/eligibility" className={styles.secondaryButton}>START</Link>
          </article>

          <article className={`${styles.guideCard} animate-on-scroll`}>
            <div className={styles.guideIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Contact Support</h3>
            <p className="body-sm">Resolve paperwork blockers quickly with volunteer guidance and filing-ready checklists.</p>
            <Link href="/support" className={styles.secondaryButton}>OPEN SUPPORT</Link>
          </article>
        </div>

        {/* Submit a Resource Section */}
        <section className={`${styles.submitCard} animate-on-scroll`} id="submit-resource">
          <div className={styles.submitHeader}>
            <h2 className="display-md">Submit a Resource</h2>
            <p className="body-md">Help other farmers by sharing local relief programs or support organizations.</p>
          </div>
          <form className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className="label">State</label>
              <select className={styles.select}>
                <option>Select state</option>
                <option value="NC">North Carolina</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className="label">Program Name</label>
              <input className={styles.input} placeholder="e.g. Hurricane Helene Relief" />
            </div>
            <div className={styles.inputGroup}>
              <label className="label">Provider</label>
              <input className={styles.input} placeholder="e.g. NCDA&CS" />
            </div>
            <div className={styles.inputGroup}>
              <label className="label">ZIP Code</label>
              <input className={styles.input} placeholder="28801" />
            </div>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className="label">Description</label>
              <textarea className={styles.textarea} placeholder="Describe the resource and eligibility requirements..." rows={5} />
            </div>
            <div className={styles.fullWidth}>
              <button type="button" className={styles.submitButton}>Submit Resource</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
