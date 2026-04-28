import { OverviewPanel } from '@/components/dashboard/OverviewPanel'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  return (
    <main className={styles.dashboardPage}>
      <section className={`${styles.dashboardHero} animate-on-scroll`}>
        <div className={styles.heroContent}>
          <p className="label">LIVE OPERATIONS</p>
          <h1 className="display-lg">FarmBridge Command Dashboard</h1>
          <p className="body-md" style={{ maxWidth: '600px' }}>
            Real-time synchronization of relief files, county risk signals, and active support queues across the NC network.
          </p>
        </div>
      </section>

      <div className="animate-on-scroll">
        <OverviewPanel />
      </div>
    </main>
  )
}
