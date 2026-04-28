import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import styles from './alerts.module.css'

export default async function AlertsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let alerts = []
  let countyByFips = new Map()

  if (user?.email) {
    const { data: rows } = await supabase
      .from('deadline_alerts')
      .select('id,email,county_fips,crop_types,program_ids,confirmed,created_at')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    alerts = rows ?? []

    const fipsList = [...new Set(alerts.map((a) => a.county_fips).filter(Boolean))]
    if (fipsList.length > 0) {
      const { data: counties } = await supabase.from('counties').select('fips_code,name').in('fips_code', fipsList)
      countyByFips = new Map((counties ?? []).map((c) => [c.fips_code, c.name]))
    }
  }

  return (
    <main className={styles.main}>
      <section className={`${styles.topBanner} animate-on-scroll`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerText}>
            <p className={styles.bannerEyebrow}>SAVED ALERTS</p>
            <h1 className={styles.bannerHeading}>Your watchlist</h1>
            <p className={styles.bannerSubtext}>
            Counties and programs you opted into through FarmBridge. Only alerts tied to your account are shown here.
            </p>
          </div>
          <p className={styles.countText}>
            {user?.email ? `${alerts.length} SAVED` : 'SIGN IN TO VIEW'}
          </p>
        </div>
      </section>

      {!user?.email ? (
        <div className={`${styles.loginHint} animate-on-scroll`} style={{ margin: '24px 40px 0' }}>
          <p className="body-md">Sign in to load deadline alerts you have saved to your profile.</p>
          <Link href="/login?redirectTo=/alerts" className={styles.primaryAction}>
            Sign in
          </Link>
        </div>
      ) : alerts.length === 0 ? (
        <div className={`${styles.emptyState} animate-on-scroll`} style={{ margin: '24px 40px 0' }}>
          <p className="body-md">You don&apos;t have any saved alerts yet.</p>
          <p className={styles.emptyHint}>
            Use the county monitor or eligibility tools to subscribe when they send alerts to your email.
          </p>
          <Link href="/programs" className={styles.primaryAction}>
            Browse programs
          </Link>
        </div>
      ) : (
        <section className={styles.alertGrid}>
          {alerts.map((alert, index) => {
            const countyName = alert.county_fips ? countyByFips.get(alert.county_fips) ?? 'County' : 'All counties'
            const crops = alert.crop_types?.length ? alert.crop_types.join(', ') : 'N/A'
            const nPrograms = alert.program_ids?.length ?? 0
            const created = alert.created_at
              ? new Date(alert.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A'

            return (
              <article
                key={alert.id}
                className={`${styles.alertCard} animate-on-scroll`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.countyName}>{countyName}</h2>
                  <span className={alert.confirmed ? styles.statusLive : styles.statusPending}>
                    {alert.confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <dl className={styles.metaList}>
                  <div>
                    <dt>FIPS</dt>
                    <dd>{alert.county_fips ?? 'N/A'}</dd>
                  </div>
                  <div>
                    <dt>Crops</dt>
                    <dd>{crops}</dd>
                  </div>
                  <div>
                    <dt>Programs tracked</dt>
                    <dd>{nPrograms}</dd>
                  </div>
                  <div>
                    <dt>Saved</dt>
                    <dd>{created}</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </section>
      )}

      <section className={`${styles.ctaStrip} animate-on-scroll`}>
        <Link href="/programs" className={styles.primaryAction}>
          Browse urgent programs
        </Link>
        <Link href="/toolkit" className={styles.secondaryAction}>
          Operational toolkit
        </Link>
      </section>
    </main>
  )
}
