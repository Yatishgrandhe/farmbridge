import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './about.module.css'

const MILESTONES=[
  {period:'Q1 2026',text:'Initial county risk tracker deployed in North Carolina.'},
  {period:'Q2 2026',text:'Federal and state relief index expanded for active filing windows.'},
  {period:'Q3 2026',text:'Volunteer manpower matching launched for farm and program support.'},
  {period:'Q4 2026',text:'Dashboard workflow introduced for operational follow-through.'},
]

export default function AboutPage(){
  return (
    <main className={styles.container}>
      <ScrollAnimator />
      <div className={styles.inner}>
        <section className={`${styles.hero} animate-on-scroll`}>
          <h1 className={styles.heroTitle}>FarmBridge was founded in response to the 2026 agricultural crisis.</h1>
          <p className={styles.heroText}>A response platform for real filing pressure, county-level volatility, and producer-first execution.</p>
        </section>

        <section className={`${styles.problemSection} animate-on-scroll`}>
          <div className={styles.problemContent}>
            <h2 className={styles.sectionTitle}>The Problem</h2>
            <p className={styles.sectionText}>Producers faced rising fertilizer prices, repeated drought stress, and fragmented aid navigation across agencies.</p>
            <p className={styles.sectionText}>FarmBridge unifies decisions into one editorially clear operating flow.</p>
          </div>
          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>“The hardest part was never the work. It was finding the right door before it closed.”</p>
            <p className={styles.quoteAuthor}>— Farm operator interview, 2026</p>
          </div>
        </section>

        <section className={`${styles.solutionSection} animate-on-scroll`}>
          <div className={styles.solutionGrid}>
            <article className={styles.solutionCard}><p className={styles.solutionNumber}>01</p><h3 className={styles.solutionTitle}>Signal</h3><p className={styles.solutionText}>County risk indicators show where pressure is rising.</p></article>
            <article className={styles.solutionCard}><p className={styles.solutionNumber}>02</p><h3 className={styles.solutionTitle}>Prioritize</h3><p className={styles.solutionText}>Urgent opportunities are surfaced first, with deadlines clear.</p></article>
            <article className={styles.solutionCard}><p className={styles.solutionNumber}>03</p><h3 className={styles.solutionTitle}>Execute</h3><p className={styles.solutionText}>Support pathways reduce delays and increase submission quality.</p></article>
          </div>
        </section>

        <section className={`${styles.infoBox} animate-on-scroll`}>
          <h2 className={styles.infoTitle}>2026 Milestones</h2>
          <ul className={styles.infoList}>{MILESTONES.map((m)=><li key={m.period} className={styles.infoListItem}><span className={styles.period}>{m.period}</span>{m.text}</li>)}</ul>
        </section>
      </div>
    </main>
  )
}
