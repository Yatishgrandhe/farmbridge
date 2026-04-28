'use client'

import Image from 'next/image'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import styles from './impact.module.css'

const IMPACT_STATS = [
  { label: 'FEDERAL FUNDS SECURED', value: 42, suffix: 'M' },
  { label: 'FARM FAMILIES SUPPORTED', value: 1250, suffix: '+' },
  { label: 'COUNTY RISK ALERTS SENT', value: 8900, suffix: '' },
  { label: 'RESPONSE TIME (AVG)', value: 24, suffix: 'H' },
]

const COUNTY_RISKS = [
  { name: 'Ashe', risk: 'High', programs: 8, status: 'Drought' },
  { name: 'Sampson', risk: 'Critical', programs: 12, status: 'Flood' },
  { name: 'Wayne', risk: 'Elevated', programs: 5, status: 'Frost' },
  { name: 'Union', risk: 'Stable', programs: 3, status: 'Normal' },
  { name: 'Wake', risk: 'Stable', programs: 4, status: 'Normal' },
]

export default function ImpactPage() {
  return (
    <main className={styles.page}>
      {/* SECTION 1: WAR ROOM HEADER */}
      <header className={`${styles.header} animate-on-scroll`}>
        <div className={styles.headerGlow} />
        <div className={styles.headerContent}>
          <p className="label">NC OPERATIONAL DASHBOARD</p>
          <h1 className="display-xl">Real-Time Impact.</h1>
          <p className="body-lg">Tracking the flow of resilience across 100 North Carolina counties.</p>
        </div>
      </header>

      {/* SECTION 2: GLOWING STATS */}
      <section className={`${styles.statsSection} animate-on-scroll`}>
        <div className={styles.statsGrid}>
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.cardGlow} />
              <p className={styles.statValue}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: COUNTY RISK MATRIX */}
      <section className={`${styles.matrixSection} animate-on-scroll`}>
        <div className={styles.sectionHeader}>
          <p className="label">REGIONAL INTELLIGENCE</p>
          <h2 className="display-lg">County Response Status.</h2>
        </div>
        
        <div className={styles.matrixContainer}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th>COUNTY</th>
                <th>RISK LEVEL</th>
                <th>ACTIVE PROGRAMS</th>
                <th>PRIMARY THREAT</th>
              </tr>
            </thead>
            <tbody>
              {COUNTY_RISKS.map((county) => (
                <tr key={county.name}>
                  <td>{county.name}</td>
                  <td>
                    <span className={`${styles.riskBadge} ${styles[`risk${county.risk}`]}`}>
                      {county.risk}
                    </span>
                  </td>
                  <td>{county.programs}</td>
                  <td>{county.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: DATA VISION */}
      <section className={`${styles.visionSection} animate-on-scroll`}>
        <div className={styles.visionGrid}>
          <div className={styles.visionVisual}>
            <div className={styles.mapGlow} />
            <Image
              fill
              className={styles.visionImg}
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85"
              alt="Aerial view of crop fields representing regional impact and data coverage"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className={styles.visionContent}>
            <p className="label">THE DATA MODEL</p>
            <h2 className="display-md">Predictive Resilience.</h2>
            <p className="body-md">
              Our proprietary impact model aggregates climatic data, federal budget cycles, 
              and regional crop health to predict where relief will be needed next. 
              By identifying pressure points early, we can move faster than the crisis.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
