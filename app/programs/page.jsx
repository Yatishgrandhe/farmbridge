'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './programs.module.css'

const CATEGORIES = ['ALL', 'DISASTER', 'OPERATIONAL', 'CONSERVATION', 'ENERGY']

const PROGRAMS = [
  { id: 1, name: 'LFP: Livestock Forage Program', category: 'DISASTER', deadline: '2026-12-01', deadline_label: 'Dec 1, 2026', is_urgent: true, description: 'Compensation for grazing losses due to drought on native or improved pasture land.' },
  { id: 2, name: 'ELAP: Emergency Assistance', category: 'DISASTER', deadline: '2026-11-15', deadline_label: 'Nov 15, 2026', is_urgent: true, description: 'Emergency assistance for livestock, honeybees, and farm-raised fish.' },
  { id: 3, name: 'REAP: Renewable Energy', category: 'ENERGY', deadline: '2027-03-31', deadline_label: 'Mar 31, 2027', is_urgent: false, description: 'Grants and loans for agricultural producers and rural small businesses for renewable energy systems.' },
  { id: 4, name: 'EQIP: Conservation Quality', category: 'CONSERVATION', deadline: '2026-10-30', deadline_label: 'Oct 30, 2026', is_urgent: false, description: 'Financial and technical assistance to address natural resource concerns and deliver environmental benefits.' },
  { id: 5, name: 'FSA Operating Loans', category: 'OPERATIONAL', deadline: null, deadline_label: 'Rolling Basis', is_urgent: false, description: 'Direct and guaranteed loans to purchase items such as livestock, farm equipment, and feed.' },
  { id: 6, name: 'NAP: Non-Insured Crop', category: 'DISASTER', deadline: '2026-09-01', deadline_label: 'Sep 1, 2026', is_urgent: true, description: 'Financial assistance to producers of non-insurable crops to protect against natural disasters.' },
]

export default function ProgramsPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const filteredPrograms = activeCategory === 'ALL' 
    ? PROGRAMS 
    : PROGRAMS.filter(p => p.category === activeCategory)

  return (
    <main className={styles.page}>
      <ScrollAnimator />
      
      {/* SECTION 1: NEWSPAPER HEADER */}
      <header className={`${styles.header} animate-on-scroll`}>
        <div className={styles.headerTop}>
          <p className="label">NORTH CAROLINA · VOL 24</p>
          <p className="label">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className={styles.headerMain}>
          <h1 className="display-xl">The Program Index</h1>
          <p className="body-lg">Active operational relief and disaster assistance files for the 2026 response window.</p>
        </div>
        <div className={styles.headerBottom}>
          <div className={styles.matrix}>
            <div className={styles.matrixItem}>
              <span className={styles.matrixLabel}>ACTIVE FILES</span>
              <span className={styles.matrixValue}>{PROGRAMS.length}</span>
            </div>
            <div className={styles.matrixItem}>
              <span className={styles.matrixLabel}>TIME CRITICAL</span>
              <span className={styles.matrixValue}>{PROGRAMS.filter(p => p.is_urgent).length}</span>
            </div>
            <div className={styles.matrixItem}>
              <span className={styles.matrixLabel}>LAST UPDATED</span>
              <span className={styles.matrixValue}>2H AGO</span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: FILTER BAR */}
      <section className={`${styles.filterSection} animate-on-scroll`}>
        <div className={styles.filterBar}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3: EDITORIAL GRID */}
      <section className={`${styles.gridSection} animate-on-scroll`}>
        <div className={styles.grid}>
          {filteredPrograms.map((program) => (
            <article key={program.id} className={styles.gridItem}>
              <div className={styles.itemHeader}>
                <span className="label" style={{ color: program.is_urgent ? 'var(--color-crisis)' : 'var(--color-mist)' }}>
                  {program.is_urgent ? '● URGENT' : 'STABLE'}
                </span>
                <span className={styles.categoryLabel}>{program.category}</span>
              </div>
              <h2 className="display-md">{program.name}</h2>
              <p className="body-sm">{program.description}</p>
              <div className={styles.itemFooter}>
                <div className={styles.deadlineInfo}>
                  <span className={styles.footerLabel}>DEADLINE</span>
                  <span className={styles.footerValue}>{program.deadline_label}</span>
                </div>
                <Link href={`/programs/${program.id}`} className={styles.detailsBtn}>
                  VIEW FILE →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 4: ASSISTANCE CTA */}
      <section className={`${styles.supportSection} animate-on-scroll`}>
        <div className={styles.supportBox}>
          <h2 className="display-md">Can&apos;t find what you need?</h2>
          <p className="body-md">Our operational support team can help you navigate the 100+ state and federal programs in our full database.</p>
          <Link href="/support" className={styles.supportBtn}>CONNECT WITH AN AGENT</Link>
        </div>
      </section>
    </main>
  )
}
