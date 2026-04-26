'use client'

import { useState } from 'react'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'

export default function ResourcesPage() {
  const [count] = useState(0)

  return (
    <main className="resources-page">
      <ScrollAnimator />
      <section className="masthead animate-on-scroll">
        <p className="label">Resource Center</p>
        <h1 className="display-lg">Resources That Save Filing Time.</h1>
        <p className="body-sm">Database currently tracks {count} local resource records.</p>
      </section>
      <section className="office animate-on-scroll">
        <h2>Weekly Office Hours</h2>
        <p>Join practical filing walkthroughs for first-time and repeat applicants.</p>
      </section>
      <section className="submit animate-on-scroll">
        <h2>Submit a Resource</h2>
        <form className="form">
          <input placeholder="Program name" />
          <input placeholder="Provider" />
          <textarea placeholder="Description" />
          <button type="button">Submit Resource</button>
        </form>
      </section>
      <style jsx>{`
        .resources-page { min-height: 100vh; padding: 7rem 1.5rem 4rem; max-width: 1100px; margin: 0 auto; }
        .masthead { border-left: 4px solid var(--color-harvest); padding-left: var(--space-lg); margin-bottom: var(--space-xl); }
        .office, .submit { background: var(--color-field); border: 1px solid var(--color-fog); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-lg); }
        h2 { margin: 0 0 var(--space-sm); color: var(--color-straw); font-family: var(--font-display); }
        p { color: var(--color-grain); }
        .form { display: grid; gap: var(--space-md); }
        input, textarea { background: var(--color-furrow); border: 1px solid var(--color-fog); border-radius: var(--radius-sm); padding: 14px; color: var(--color-grain); }
        button { background: var(--color-harvest); border: none; border-radius: var(--radius-pill); color: var(--color-straw); padding: 12px 20px; transition: background var(--transition-base); }
        button:hover { background: var(--color-harvest-hover); }
      `}</style>
    </main>
  )
}
