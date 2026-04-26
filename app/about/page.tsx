'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  const timeline = [
    { period: 'Jan 2026', detail: 'FarmBridge prototype launched with 12 relief programs tracked.' },
    { period: 'Mar 2026', detail: 'County-level urgency model introduced for drought declarations.' },
    { period: 'Apr 2026', detail: 'Eligibility wizard and deadline reminders rolled out statewide.' },
  ]

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-16"
      >
        <div className="text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-wheat mb-6">Our Mission</h1>
          <p className="text-wheat/70 font-body text-xl leading-relaxed">
            FarmBridge was founded in response to the 2026 agricultural crisis. We are technologists, 
            policymakers, and former farmers working to connect rural North Carolina with the resources they need to survive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-soil border border-wheat/10 rounded-3xl p-8 md:p-12">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-wheat">The Problem</h2>
            <p className="font-body text-wheat/80 leading-relaxed">
              When the Strait of Hormuz closed in early 2026, global fertilizer prices surged by 50%. 
              Combined with the worst drought in North Carolina history, farm bankruptcies spiked by 46%. 
            </p>
            <p className="font-body text-wheat/80 leading-relaxed">
              The federal government responded by allocating billions in relief funds. But navigating the USDA, 
              FSA, and SBA bureaucracy is nearly impossible for farmers working 80-hour weeks just to keep their 
              operations afloat. 
            </p>
          </div>
          <div className="bg-ash/50 rounded-2xl p-8 border border-crisis/20">
            <h3 className="font-display text-xl text-crisis mb-4">
              &ldquo;I don&apos;t have time to fill out 40 pages of forms to find out I&apos;m not eligible.&rdquo;
            </h3>
            <p className="text-wheat/50 font-body text-sm">— Third-generation corn farmer, Sampson County NC</p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="font-display text-3xl font-bold text-wheat text-center">The FarmBridge Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ash p-8 rounded-2xl border border-wheat/5">
              <div className="text-ember text-2xl mb-4">01</div>
              <h3 className="font-display font-bold text-wheat mb-2">Centralized Data</h3>
              <p className="text-sm font-body text-wheat/60">We aggregate every federal, state, and local agricultural relief program into a single database.</p>
            </div>
            <div className="bg-ash p-8 rounded-2xl border border-wheat/5">
              <div className="text-ember text-2xl mb-4">02</div>
              <h3 className="font-display font-bold text-wheat mb-2">Smart Eligibility</h3>
              <p className="text-sm font-body text-wheat/60">Our proprietary engine matches farmers with programs they actually qualify for in under 3 minutes.</p>
            </div>
            <div className="bg-ash p-8 rounded-2xl border border-wheat/5">
              <div className="text-ember text-2xl mb-4">03</div>
              <h3 className="font-display font-bold text-wheat mb-2">Deadline Tracking</h3>
              <p className="text-sm font-body text-wheat/60">We monitor application windows and alert farmers before critical funds run out.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-soil/60 border border-wheat/10 rounded-2xl p-7">
            <h2 className="font-display text-2xl text-wheat mb-4">How We Work</h2>
            <ul className="space-y-3 text-sm text-wheat/75">
              <li>- We prioritize programs by urgency, eligibility fit, and documentation burden.</li>
              <li>- We translate policy language into actionable steps for busy farm operators.</li>
              <li>- We partner with local extension networks for practical, county-specific support.</li>
            </ul>
          </section>
          <section className="bg-soil/60 border border-wheat/10 rounded-2xl p-7">
            <h2 className="font-display text-2xl text-wheat mb-4">2026 Milestones</h2>
            <ul className="space-y-3">
              {timeline.map((item) => (
                <li key={item.period} className="text-sm">
                  <span className="text-ember font-mono mr-2">{item.period}</span>
                  <span className="text-wheat/75">{item.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

      </motion.div>
    </div>
  )
}
