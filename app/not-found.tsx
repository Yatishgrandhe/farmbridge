import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, Home, Search } from 'lucide-react'

import styles from './not-found.module.css'

export const metadata: Metadata = {
  title: '404 — Page Not Found | FarmBridge',
  description:
    "This page doesn't exist. Return to FarmBridge to find relief programs, eligibility tools, and county alerts.",
}

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <p className={styles.eyebrow}>
            <Compass size={14} />
            PAGE NOT FOUND
          </p>

          <p className={styles.codeRow} aria-label="404">
            <span className={styles.digit}>4</span>
            <span className={`${styles.digit} ${styles.zero}`}>0</span>
            <span className={styles.digit}>4</span>
          </p>

          <h1 className={styles.heading}>Looks like this field is fallow.</h1>
          <p className={styles.subtext}>
            The page you&apos;re looking for has been moved, removed, or never existed. Let&apos;s get you back to
            productive ground.
          </p>

          <div className={styles.divider} />

          <div className={styles.actionRow}>
            <Link href="/" className={styles.primaryButton}>
              <Home size={14} />
              Back to Home
            </Link>
            <Link href="/programs" className={styles.secondaryButton}>
              <Search size={14} />
              Browse Programs
            </Link>
          </div>

          <p className={styles.helperLinks}>
            <Link href="/programs">Programs</Link>
            <span>·</span>
            <Link href="/support">Support</Link>
            <span>·</span>
            <Link href="/eligibility">Eligibility</Link>
          </p>
        </div>
      </section>

      <aside className={styles.rightPanel} aria-hidden="true">
        <div className={styles.illustrationWrap}>
          <svg viewBox="0 0 320 320" className={styles.fieldSvg} role="img">
            <rect x="0" y="0" width="320" height="192" fill="#FDF8F0" />
            <rect x="0" y="192" width="320" height="128" fill="#EDE7DA" />
            <line x1="0" y1="192" x2="320" y2="192" stroke="#DDD9CF" strokeWidth="1.5" />

            <circle cx="266" cy="62" r="16" fill="#E8A87C" />

            <path d="M-20 214 C40 198, 120 198, 200 214 C250 224, 300 224, 340 214" stroke="#C4BDB0" strokeWidth="1.5" fill="none" />
            <path d="M-20 230 C40 214, 120 214, 200 230 C250 240, 300 240, 340 230" stroke="#DDD9CF" strokeWidth="1.5" fill="none" />
            <path d="M-20 246 C40 230, 120 230, 200 246 C250 256, 300 256, 340 246" stroke="#C4BDB0" strokeWidth="1.5" fill="none" />
            <path d="M-20 262 C40 246, 120 246, 200 262 C250 272, 300 272, 340 262" stroke="#DDD9CF" strokeWidth="1.5" fill="none" />
            <path d="M-20 278 C40 262, 120 262, 200 278 C250 288, 300 288, 340 278" stroke="#C4BDB0" strokeWidth="1.5" fill="none" />

            <g className={styles.sprout}>
              <path d="M160 246 C160 230, 160 220, 160 214" stroke="#C4622D" strokeWidth="2" fill="none" />
              <path d="M160 224 C152 220, 146 214, 146 206 C152 208, 158 212, 160 218" stroke="#C4622D" strokeWidth="2" fill="none" />
              <path d="M160 222 C168 218, 174 212, 174 204 C168 206, 162 210, 160 216" stroke="#C4622D" strokeWidth="2" fill="none" />
            </g>
          </svg>
          <p className={styles.caption}>Every field needs a fallow season.</p>
        </div>
      </aside>
    </main>
  )
}
