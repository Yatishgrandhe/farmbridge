import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './alerts.module.css'

function severityLabel(level) {
  if (!level) return 'None'
  if (level.toLowerCase().includes('extreme') || level.toLowerCase().includes('severe')) return 'Severe'
  if (level.toLowerCase().includes('moderate')) return 'Moderate'
  return 'Watch'
}

export default async function AlertsPage() {
  const supabase = await createServerClient()
  const { data: counties } = await supabase
    .from('counties')
    .select('name,drought_level,precipitation_deficit_inches')
    .order('precipitation_deficit_inches', { ascending: false })
    .limit(12)

  const rows = counties ?? []
  const maxDeficit = Math.max(1, ...rows.map((item) => Number(item.precipitation_deficit_inches ?? 0)))

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <section className={`${styles.banner} animate-on-scroll`}>
        <div className={styles.bannerContent}>
          <p className={styles.liveLabel}><span className={styles.pulseDot} /> LIVE RELIEF ALERTS</p>
          <h1 className="display-lg">County Monitor</h1>
          <p className="body-md">Real-time drought pressure and rainfall deficits across tracked North Carolina counties.</p>
        </div>
        <p className={styles.countText}>{rows.length} COUNTIES UNDER MONITOR</p>
      </section>

      <section className={styles.alertGrid}>
        {rows.map((county, index) => {
          const deficit = Number(county.precipitation_deficit_inches ?? 0)
          const width = `${Math.max(8, (deficit / maxDeficit) * 100)}%`
          const severity = severityLabel(county.drought_level)
          const severityClass = severity === 'Severe' ? styles.severe : severity === 'Moderate' ? styles.moderate : styles.none
          
          return (
            <article 
              key={county.name} 
              className={`${styles.alertCard} ${severityClass} animate-on-scroll`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.countyName}>{county.name}</h2>
                <span className={`${styles.severityPill} ${severityClass}`}>{severity}</span>
              </div>
              
              <div className={styles.rainfallRow}>
                <div className={styles.rainfallInfo}>
                  <span className={styles.valueLabel}>PRECIPITATION DEFICIT</span>
                  <span className={styles.valueLabel}>{deficit.toFixed(1)} IN</span>
                </div>
                <div className={styles.track}><span className={styles.fill} style={{ width }} /></div>
              </div>
              
              <p className={styles.recommendation}>
                Operational Alert: Prioritize drought-relief and operating-credit programs for this region.
              </p>
              
              <button type="button" className={styles.watchButton}>
                ADD TO WATCHLIST →
              </button>
            </article>
          )
        })}
      </section>

      <section className={`${styles.ctaStrip} animate-on-scroll`}>
        <Link href="/programs" className={styles.primaryAction}>Browse Urgent Programs</Link>
        <Link href="/resources" className={styles.secondaryAction}>Access Operational Toolkit</Link>
      </section>
    </main>
  )
}
