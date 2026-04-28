'use client'

import styles from './about.module.css'

const MILESTONES = [
  { period: 'JAN 2026', title: 'Crisis Response Initiated', text: 'FarmBridge founded in Raleigh, NC to address the fertilizer and drought crisis.' },
  { period: 'MAR 2026', title: 'County Network Live', text: 'Real-time tracking of USDA disaster declarations expanded across all 100 NC counties.' },
  { period: 'JUN 2026', title: 'Manpower Matching', text: 'Volunteer matching system deployed, pairing retired agents with active filing needs.' },
  { period: 'SEP 2026', title: 'Institutional Rollout', text: 'Operational partnerships established with 12 regional agricultural cooperatives.' },
]

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* FULL WIDTH EDITORIAL HERO */}
      <section className={`${styles.hero} animate-on-scroll`}>
        <div 
          className={styles.heroBg} 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1600&auto=format&fit=crop&q=80')` }} 
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className="label" style={{ color: 'var(--color-harvest)', marginBottom: 'var(--space-md)' }}>OUR GENESIS</p>
          <h1 className="display-xl">Bridging the gap between policy and the field.</h1>
        </div>
      </section>

      {/* LONG FORM ARTICLE SECTION */}
      <section className={`${styles.articleSection} animate-on-scroll`}>
        <div className={styles.articleGrid}>
          <aside className={styles.articleMeta}>
            <p className="label">THE MISSION</p>
            <p className="body-sm">To ensure no North Carolina farm is lost to administrative friction during a climate or economic crisis.</p>
          </aside>
          
          <div className={styles.articleBody}>
            <h2 className="display-md">A response to the 2026 crisis.</h2>
            <p className="body-md">
              FarmBridge was born in the wake of unprecedented pressure on the American Southeast. 
              Between record drought cycles and global fertilizer shortages, the administrative 
              burden of securing federal relief became a second full-time job for farmers already 
              stretched to their breaking points.
            </p>
            <p className="body-md">
              We realized that the information was out there, but it was fragmented, buried in 
              agency PDFs, county press releases, and federal registers. FarmBridge was built 
              to consolidate that intelligence into a single, operational dashboard for the modern producer.
            </p>
            
            <blockquote className={styles.pullQuote}>
              &ldquo;The hardest part was never the work in the field. It was finding the right 
              door to knock on before the deadline closed.&rdquo;
              <cite>James R., Wayne County Tobacco Farmer</cite>
            </blockquote>

            <p className="body-md">
              Today, our platform tracks every USDA disaster declaration, every SBA loan window, 
              and every state-level grant in real-time. We pair this data with a human network 
              of volunteer agents who understand the nuances of the application process.
            </p>
          </div>
        </div>
      </section>

      {/* IMAGE BREAK */}
      <section className={`${styles.imageBreak} animate-on-scroll`}>
        <img 
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format&fit=crop&q=80" 
          alt="Farmland view" 
        />
      </section>

      {/* TIMELINE SECTION */}
      <section className={`${styles.timelineSection} animate-on-scroll`}>
        <div className={styles.timelineHeader}>
          <p className="label">PLATFORM VELOCITY</p>
          <h2 className="display-lg">The Journey So Far.</h2>
        </div>
        <div className={styles.timelineGrid}>
          {MILESTONES.map((item) => (
            <div key={item.period} className={styles.timelineItem}>
              <span className={styles.timelineDate}>{item.period}</span>
              <h3 className="display-sm">{item.title}</h3>
              <p className="body-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
