import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './alerts.module.css'

function severityClass(level){
  if(!level || level==='none') return 'none'
  if(level==='extreme' || level==='severe') return 'critical'
  if(level==='moderate') return 'warning'
  return 'none'
}

function severityLabel(level){
  if(!level || level==='none') return 'No Drought'
  if(level==='abnormally_dry') return 'Abnormally Dry'
  return level.replace(/_/g,' ').replace(/\w/g,(m)=>m.toUpperCase())
}

export default async function AlertsPage(){
  const supabase=await createServerClient()
  const {data}=await supabase.from('counties').select('name,drought_level,precipitation_deficit_inches').order('precipitation_deficit_inches',{ascending:false}).limit(24)
  const counties=data??[]

  return (
    <main className={styles.main}>
      <ScrollAnimator />
      <div className={styles.container}>
        <section className={`${styles.header} animate-on-scroll`}>
          <span className={`${styles.headerSpan} label`}>Live Relief Alerts</span>
          <h1 className={styles.headerTitle}>County Monitor</h1>
          <p className={styles.headerText}>County-level drought severity and rainfall deficit tracking.</p>
        </section>

        <section className={`${styles.alertList} animate-on-scroll`}>
          {counties.length===0 ? <div className={styles.emptyState}><p className={styles.emptyTitle}>No alert data available.</p><p className={styles.emptyText}>Retry after next sync.</p></div> : counties.map((county)=>(
            <article key={county.name} className={styles.alertCard}>
              <div className={styles.alertInfo}>
                <h2 className={styles.alertCounty}>{county.name} County</h2>
                <p className={styles.alertIssue}>Rainfall deficit: {county.precipitation_deficit_inches ?? 0} in</p>
                <p className={styles.alertAction}>Recommended action: review urgent programs now.</p>
              </div>
              <span className={styles.alertBadge} data-level={severityClass(county.drought_level)}>{severityLabel(county.drought_level)}</span>
            </article>
          ))}
        </section>

        <section className={`${styles.nextStepsBox} animate-on-scroll`}>
          <h2 className={styles.nextStepsTitle}>After an Alert</h2>
          <ol className={styles.stepsGrid}>
            <li className={styles.stepItem}>Review county-level risk context.</li>
            <li className={styles.stepItem}>Open urgent funding programs.</li>
            <li className={styles.stepItem}>Move into submission toolkit.</li>
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
