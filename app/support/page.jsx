'use client'

import { useState } from 'react'
import styles from './support.module.css'

const FAQ=[
  {q:'How quickly should I apply after a declaration?',a:'Apply as soon as core records are ready. Most relief tracks are deadline-sensitive.'},
  {q:'Can FarmBridge submit forms for me?',a:'No. We guide filing steps and route support resources; official submission stays with the applicant.'},
  {q:'Can I use this outside North Carolina?',a:'Yes. NC has deeper county intelligence right now, but core workflows are nationwide.'},
]

export default function SupportPage(){
  const [openIndex,setOpenIndex]=useState(0)
  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <header
          className={`${styles.header} animate-on-scroll`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.72)), url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
          }}
        >
          <h1 className={styles.headerTitle}>Navigating federal bureaucracy is hard. We are here to help.</h1>
          <p className={styles.headerText}>Our volunteers typically respond within 24 hours.</p>
        </header>

        <div className={`${styles.mainGrid} animate-on-scroll`}>
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>FAQ</h2>
            <div className={styles.faqList}>{FAQ.map((item,index)=>{const isOpen=index===openIndex;return <article key={item.q} className={`${styles.faqItem} ${isOpen?styles.faqItemOpen:''}`}><button className={styles.faqButton} onClick={()=>setOpenIndex(isOpen?-1:index)}><span className={styles.faqQuestion}>{item.q}</span><span className={styles.faqToggle}>{isOpen?'−':'+'}</span></button>{isOpen && <p className={styles.faqAnswer}>{item.a}</p>}</article>})}</div>
          </section>

          <section className={styles.contactCard}>
            <h2 className={styles.contactTitle}>Contact Form</h2>
            <p className={styles.contactSubtitle}>Share the blocker in your application process.</p>
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
