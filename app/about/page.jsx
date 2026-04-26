import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './about.module.css'

const MILESTONES = [
  { period: 'Q1 2026', text: 'Initial county-risk ingestion launched for NC drought watch.' },
  { period: 'Q2 2026', text: 'Expanded federal + state relief dataset and urgency scoring.' },
  { period: 'Q3 2026', text: 'Volunteer labor exchange and resource intake shipped live.' },
  { period: 'Q4 2026', text: 'Farmer dashboard + deadline tracking rolled out statewide.' },
]

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <ScrollAnimator />
      <div className={styles.inner}>
        <section className={`${styles.hero} animate-on-scroll`}>
          <p className="label" style={{ color: 'var(--color-harvest)' }}>Our Mission</p>
          <h1 className={styles.heroTitle}>FarmBridge was founded in response to the 2026 agricultural crisis.</h1>
          <p className={styles.heroText}>We organize fragmented aid systems into one operational platform so farmers can act before deadlines close.</p>
        </section>

        <section className={`${styles.problemSection} animate-on-scroll`}>
          <div className={styles.problemContent}>
            <h2 className={styles.sectionTitle}>The Problem</h2>
            <p className={styles.sectionText}>Rising fertilizer costs, drought pressure, and delayed agency outreach created a high-friction filing environment for working farms.</p>
            <p className={styles.sectionText}>FarmBridge reduces that friction by combining county stress data, program timelines, and local support pathways into one decision flow.</p>
          </div>
          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>“The cost was not just weather. It was time lost navigating systems not built for urgency.”</p>
            <p className={styles.quoteAuthor}>- North Carolina producer interview, 2026</p>
          </div>
        </section>

        <section className={`${styles.solutionSection} animate-on-scroll`}>
          <h2 className={styles.sectionTitle}>How FarmBridge Responds</h2>
          <div className={styles.solutionGrid}>
            <article className={styles.solutionCard}><p className={styles.solutionNumber}>01</p><h3 className={styles.solutionTitle}>Locate</h3><p className={styles.solutionText}>County-level severity, declaration status, and program relevance in one view.</p></article>
            <article className={styles.solutionCard}><p className={styles.solutionNumber}>02</p><h3 className={styles.solutionTitle}>Prioritize</h3><p className={styles.solutionText}>Urgent deadlines and funding levels surfaced first.</p></article>
            <article className={styles.solutionCard}><p className={styles.solutionNumber}>03</p><h3 className={styles.solutionTitle}>Submit</h3><p className={styles.solutionText}>Step-by-step application rhythm with support routing.</p></article>
          </div>
        </section>

        <section className={`${styles.infoBox} animate-on-scroll`}>
          <h2 className={styles.infoTitle}>2026 Milestones</h2>
          <ul className={styles.infoList}>
            {MILESTONES.map((item) => (
              <li key={item.period} className={styles.infoListItem}><span className={styles.period}>{item.period}</span>{item.text}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
