import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './alerts.module.css'

function severityClass(level) {
  if (!level) return 'none'
  if (level === 'extreme' || level === 'severe') return 'critical'
  if (level === 'moderate') return 'warning'
  return 'none'
}

function severityLabel(level) {
  if (!level || level === 'none') return 'No Drought'
  if (level === 'abnormally_dry') return 'Abnormally Dry'
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export default async function AlertsPage() {
  const supabase = await createServerClient()
  const { data: counties } = await supabase
    .from('counties')
    .select('name,drought_level,precipitation_deficit_inches,is_primary_disaster_area')
    .order('precipitation_deficit_inches', { ascending: false })
    .limit(24)

  const rows = counties ?? []

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <div className={styles.container}>
        <section className={`${styles.header} animate-on-scroll`}>
          <span className={`${styles.headerSpan} label`}>Live Relief Alerts</span>
          <h1 className={styles.headerTitle}>County Monitor</h1>
          <p className={styles.headerText}>Monitor county risk shifts and turn alerts into rapid filing actions.</p>
        </section>

        <section className={`${styles.alertList} animate-on-scroll`}>
          {rows.length === 0 ? (
            <div className={styles.emptyState}><p className={styles.emptyTitle}>No alert data available.</p><p className={styles.emptyText}>Check back after the next sync cycle.</p></div>
          ) : rows.map((county) => (
            <article key={county.name} className={styles.alertCard}>
              <div className={styles.alertInfo}>
                <h2 className={styles.alertCounty}>{county.name} County</h2>
                <p className={styles.alertIssue}>Rainfall deficit: {county.precipitation_deficit_inches ?? 0} in</p>
                <p className={styles.alertAction}>Recommended action: Review urgent deadlines and county support contacts.</p>
              </div>
              <span className={styles.alertBadge} data-level={severityClass(county.drought_level)}>
                {severityLabel(county.drought_level)}
              </span>
            </article>
          ))}
        </section>

        <section className={`${styles.nextStepsBox} animate-on-scroll`}>
          <h2 className={styles.nextStepsTitle}>After an Alert</h2>
          <ol className={styles.stepsGrid}>
            <li className={styles.stepItem}>Review county-level urgency signals.</li>
            <li className={styles.stepItem}>Open current urgent relief programs.</li>
            <li className={styles.stepItem}>Move to filing toolkit and submit.</li>
          </ol>
          <div className={styles.actionGroup}>
            <Link href="/programs" className={styles.primaryAction}>Browse Urgent Programs</Link>
            <Link href="/resources" className={styles.secondaryAction}>Open Toolkit</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
