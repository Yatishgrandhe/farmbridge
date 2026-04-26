'use client'

import { useState } from 'react'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './support.module.css'

const FAQ = [
  { q: 'How quickly should I apply after a disaster declaration?', a: 'As soon as supporting records are collected. Most losses require prompt filing windows and documentation.' },
  { q: 'Can I use FarmBridge if I am outside North Carolina?', a: 'Yes. FarmBridge supports US routing, with strongest county depth currently in North Carolina.' },
  { q: 'Do you submit forms on my behalf?', a: 'No. We guide you through requirements, deadlines, and resources so you can submit complete applications.' },
]

export default function SupportPage() {
  const [open, setOpen] = useState(0)

  return (
    <main className={styles.container}>
      <ScrollAnimator />
      <div className={styles.inner}>
        <header className={`${styles.header} animate-on-scroll`}>
          <h1 className={styles.headerTitle}>Navigating federal bureaucracy is hard. We are here to help.</h1>
          <p className={styles.headerText}>Our volunteers typically respond within 24 hours.</p>
        </header>

        <div className={`${styles.mainGrid} animate-on-scroll`}>
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {FAQ.map((item, index) => {
                const isOpen = index === open
                return (
                  <article key={item.q} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                    <button className={styles.faqButton} onClick={() => setOpen(isOpen ? -1 : index)}>
                      <span className={styles.faqQuestion}>{item.q}</span>
                      <span className={styles.faqToggle}>{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && <p className={styles.faqAnswer}>{item.a}</p>}
                  </article>
                )
              })}
            </div>
          </section>

          <section className={styles.contactCard}>
            <h2 className={styles.contactTitle}>Contact Support</h2>
            <p className={styles.contactSubtitle}>Tell us what is blocking your application.</p>
            <form className={styles.form}>
              <div className={styles.inputGroup}><label className={styles.label}>Name</label><input className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>County</label><input className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>How can we help?</label><textarea className={styles.textarea} rows={5} /></div>
              <button type="button" className={styles.submitButton}>Send Request</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
