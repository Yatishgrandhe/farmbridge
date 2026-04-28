import Link from 'next/link'
import { ArrowRight, ClipboardCheck, MapPin } from 'lucide-react'
import { OverviewPanel, getDashboardOverviewData } from '@/components/dashboard/OverviewPanel'
import styles from '../dashboard.module.css'

const KPI_ITEMS = [
  { key: 'activePrograms', label: 'Active Programs' },
  { key: 'urgentFiles', label: 'Urgent Files' },
  { key: 'countiesTracked', label: 'Counties Tracked' },
  { key: 'networkUpdates', label: 'Network Updates' },
]

export default async function OverviewPage() {
  const overviewData = await getDashboardOverviewData()

  return (
    <main className={styles.dashboardPage}>
      <section className={`${styles.topBanner} animate-on-scroll`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerText}>
            <p className={styles.bannerEyebrow}>
              <MapPin size={12} />
              NC AGRICULTURAL NETWORK
            </p>
            <h1 className={styles.bannerHeading}>Operational Command</h1>
            <p className={styles.bannerSubtext}>
              Real-time synchronization of relief files, county risk signals, and active support queues across the NC network.
            </p>
          </div>
          <div className={styles.bannerActions}>
            <Link href="/eligibility" className={styles.secondaryButton}>
              <ClipboardCheck size={15} />
              Run Eligibility
            </Link>
            <Link href="/volunteer" className={styles.primaryButton}>
              <ArrowRight size={15} />
              Volunteer Hub
            </Link>
          </div>
        </div>

        <div className={styles.kpiStrip}>
          {KPI_ITEMS.map((item) => (
            <div key={item.key} className={styles.kpiItem}>
              <p className={styles.kpiValue}>{overviewData.counts[item.key]}</p>
              <p className={styles.kpiLabel}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="animate-on-scroll">
        <OverviewPanel data={overviewData} />
      </div>
    </main>
  )
}
