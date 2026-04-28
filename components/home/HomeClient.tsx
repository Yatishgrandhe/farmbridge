'use client'

import Link from 'next/link'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { CountyReliefMapSection } from '@/components/maps/CountyReliefMapSection'
import type { CountyRisk, MapOverlay } from '@/components/maps/CountyReliefMapSection'
import type { HomeStat } from '@/lib/home/buildHomePayload'
import styles from '@/app/page.module.css'

const CRISIS_CARDS = [
  {
    id: '01',
    category: 'ENVIRONMENTAL',
    title: 'Disaster Assistance',
    body: 'Direct federal compensation for crops lost to drought, excessive heat, or flooding cycles.',
    href: '/programs?category=disaster_relief',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '02',
    category: 'OPERATIONAL',
    title: 'Input Cost Relief',
    body: 'Strategic funding to offset fertilizer price volatility and energy expenditure spikes.',
    href: '/programs?category=loan',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: '03',
    category: 'INFRASTRUCTURE',
    title: 'Resilience Grants',
    body: 'Modernization capital for water management systems and climate-stable infrastructure.',
    href: '/programs?category=conservation',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80',
  },
]

type HomeClientProps = {
  stats: HomeStat[]
  counties: CountyRisk[]
  overlays: MapOverlay[]
}

export function HomeClient({ stats, counties, overlays }: HomeClientProps) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroVisual}>
          <div className={styles.grainLayer} />
          <div className={styles.heroOverlay} />
          <div className={styles.backgroundImg} />
        </div>

        <div className={styles.heroContent}>
          <header className={`${styles.heroHeader} animate-on-scroll`}>
            <p className="label">EST. 2026 · NC RESPONSE UNIT</p>
            <h1 className="display-xl">Protect the Harvest. Secure the Future.</h1>
            <p className="body-lg" style={{ maxWidth: '800px', margin: 'var(--space-xl) auto' }}>
              FarmBridge is the operational nervous system for North Carolina&apos;s agricultural
              resilience, connecting producers to critical federal relief with surgical precision.
            </p>
            <div className={styles.heroActions}>
              <Link href="/programs" className={styles.primaryCta}>
                VIEW ACTIVE PROGRAMS
              </Link>
              <Link href="/eligibility" className={styles.secondaryCta}>
                RUN ELIGIBILITY CHECK
              </Link>
            </div>
          </header>
        </div>

        <div className={styles.scrollGuide}>
          <div className={styles.guideLine} />
          <span className={styles.guideText}>OPERATIONAL INTELLIGENCE</span>
        </div>
      </section>

      <section className={`${styles.statsSection} animate-on-scroll`}>
        <div className={styles.statsInner}>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <p className={styles.statValue}>
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.mapSection} animate-on-scroll`}>
        <div className={styles.sectionHeader}>
          <p className="label">COUNTY INTELLIGENCE</p>
          <h2 className="display-lg">Live drought & volunteer footprint.</h2>
          <div className={styles.headerRule} />
        </div>
        <CountyReliefMapSection counties={counties} overlays={overlays} />
      </section>

      <section className={`${styles.crisisSection} animate-on-scroll`}>
        <div className={styles.sectionHeader}>
          <p className="label">OPERATIONAL PATHWAYS</p>
          <h2 className="display-lg">Immediate Relief Navigation.</h2>
          <div className={styles.headerRule} />
        </div>

        <div className={styles.crisisGrid}>
          {CRISIS_CARDS.map((card) => (
            <Link key={card.id} href={card.href} className={styles.crisisCard}>
              <div
                className={styles.cardBg}
                style={{
                  backgroundImage: `linear-gradient(to top, var(--bg-base) 0%, rgba(250, 250, 248, 0.35) 50%, transparent 100%), url(${card.image})`,
                }}
              />
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className="label">{card.category}</span>
                  <span className={styles.cardId}>{card.id}</span>
                </div>
                <h3 className="display-md">{card.title}</h3>
                <p className="body-sm">{card.body}</p>
                <span className={styles.cardCta}>NAVIGATE PROGRAM →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.editorialSection} animate-on-scroll`}>
        <div className={styles.editorialGrid}>
          <div className={styles.editorialText}>
            <p className="label">FIELD REPORTS</p>
            <h2 className="display-md">Bridging the administrative gap.</h2>
            <p className="body-md">
              We understand that when disaster strikes, the last thing you need is a 40-page PDF from a federal
              agency. FarmBridge was designed to distill complex regulations into actionable steps for every North
              Carolina producer.
            </p>
            <blockquote className={styles.quote}>
              &ldquo;FarmBridge transformed our recovery. They didn&apos;t just show us the programs; they showed us
              the path to approval.&rdquo;
              <cite>Martha G., Sampson County Soy Producer</cite>
            </blockquote>
          </div>
          <div className={styles.editorialVisual}>
            <div className={styles.visualOverlay} />
            <img
              src="https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1200&auto=format&fit=crop&q=80"
              alt="Farmer in field"
            />
          </div>
        </div>
      </section>

      <section className={`${styles.finalSection} animate-on-scroll`}>
        <div className={styles.finalContent}>
          <h2 className="display-lg">Ready to secure your legacy?</h2>
          <p className="body-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
            Join North Carolina producers already using FarmBridge to navigate the 2026 crisis.
          </p>
          <div className={styles.heroActions}>
            <Link href="/signup" className={styles.primaryCta}>
              GET STARTED FOR FREE
            </Link>
            <Link href="/support" className={styles.secondaryCta}>
              TALK TO AN AGENT
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
