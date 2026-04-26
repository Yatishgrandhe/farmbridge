import Link from 'next/link'
import Image from 'next/image'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import styles from './HeroSection.module.css'

type HeroStat = {
  value: number
  suffix: string
  label: string
  prefix: string
}

const DEFAULT_STATS: HeroStat[] = [
  { value: 50, suffix: '', label: 'states with active\nrelief tracking focus', prefix: '' },
  { value: 46, suffix: '%', label: 'rise in farm\nbankruptcies trend', prefix: '+' },
  { value: 50, suffix: '%', label: 'fertilizer price\nsurge pressure', prefix: '+' },
  { value: 624.7, suffix: 'B', label: 'total US farm\ndebt (record)', prefix: '$' },
]

const HERO_IMAGES = {
  field:
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80',
}

export function HeroSection({ stats = DEFAULT_STATS }: { stats?: HeroStat[] }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        {/* Overline */}
        <div className={styles.overline}>
          <span className={styles.dotContainer}>
            <span className={styles.dot} />
          </span>
          <span className={styles.overlineText}>
            Crisis Response Platform · United States · 2026
          </span>
        </div>

        <div className={styles.mainGrid}>
          <div>
            <h1 className={styles.heroTitle}>
              US Farmers
              <br />
              <span className={styles.titleHighlight}>deserve to know</span>
              <br />
              what help exists.
            </h1>

            <p className={styles.heroDesc}>
              National drought, debt pressure, and rising inputs are squeezing farms coast to coast.
              Relief programs exist - but many producers still can&apos;t find the right path. FarmBridge changes that.
            </p>

            <div className={styles.ctaGroup}>
              <Link href="/eligibility" className={styles.primaryCta}>
                <span className={styles.primaryCtaText}>Check My Eligibility →</span>
              </Link>
              <Link href="/programs" className={styles.secondaryCta}>
                Browse All Programs
              </Link>
            </div>
          </div>

          <div>
            <div className={styles.imageWrapper}>
              <Image
                src={HERO_IMAGES.field}
                alt="United States farmland landscape"
                width={900}
                height={700}
                className={styles.heroImage}
                priority
              />
              <div className={styles.imageGradient} />
              <div className={styles.imageCaption}>
                <p className={styles.captionTitle}>Regional drought + rising input costs</p>
                <p className={styles.captionDesc}>Fast matching and urgent-deadline tracking for farms nationwide.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Crisis Stats Grid */}
        <dl className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <dt className={styles.statLabel}>
                {stat.label}
              </dt>
              <dd className={styles.statValue}>
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                  duration={2500}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

