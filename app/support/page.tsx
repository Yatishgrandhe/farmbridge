'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  {
    q: "I don't have my 2025 Schedule F yet. Can I still apply for SDRP?",
    a: "Yes. For emergency applications submitted before April 15, you can use your 2024 Schedule F alongside a certified yield loss projection for 2025."
  },
  {
    q: "Do I have to pay back the relief grants?",
    a: "Most programs listed on FarmBridge, including the State Drought Relief Program (SDRP), are block grants and do not need to be repaid. However, SBA Economic Injury Disaster Loans (EIDL) are loans that must be repaid."
  },
  {
    q: "My county isn't listed as a primary disaster area. Am I eligible?",
    a: "If your county is contiguous (touching) a declared primary disaster area, you are still eligible for FSA emergency loans and most state-level assistance."
  }
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-wheat mb-6">Support & Resources</h1>
          <p className="text-wheat/70 font-body text-xl max-w-2xl mx-auto">
            Navigating federal bureaucracy is hard. We&apos;re here to help you get the assistance you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-wheat mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div 
                  key={i} 
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${openFaq === i ? 'bg-soil border-growth/30' : 'bg-transparent border-wheat/10 hover:border-wheat/30'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-6 flex justify-between items-center"
                  >
                    <span className="font-body font-semibold text-wheat pr-8">{faq.q}</span>
                    <span className="text-growth font-bold text-xl">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-wheat/70 font-body text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-soil border border-wheat/10 rounded-3xl p-8 shadow-card h-fit">
            <h2 className="font-display text-2xl font-bold text-wheat mb-2">Contact FarmBridge</h2>
            <p className="text-wheat/60 font-body text-sm mb-8">
              Need 1-on-1 help with an application? Our volunteers typically respond within 24 hours.
            </p>
            
            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-wheat/80 font-body text-sm font-semibold mb-2">Name</label>
                <input type="text" className="w-full bg-ash border border-wheat/10 rounded-xl px-4 py-3 text-wheat focus:outline-none focus:border-growth transition-colors" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-wheat/80 font-body text-sm font-semibold mb-2">County</label>
                <input type="text" className="w-full bg-ash border border-wheat/10 rounded-xl px-4 py-3 text-wheat focus:outline-none focus:border-growth transition-colors" placeholder="Sampson County" />
              </div>
              <div>
                <label className="block text-wheat/80 font-body text-sm font-semibold mb-2">How can we help?</label>
                <textarea rows={4} className="w-full bg-ash border border-wheat/10 rounded-xl px-4 py-3 text-wheat focus:outline-none focus:border-growth transition-colors" placeholder="I'm having trouble uploading my documents..." />
              </div>
              <button className="w-full py-4 bg-growth text-parchment font-body font-semibold rounded-xl transition-all hover:bg-growth/90 active:scale-[0.98]">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-crisis/30 bg-crisis/10 p-5">
            <p className="text-crisis font-mono text-xs uppercase tracking-widest mb-2">Urgent Line</p>
            <p className="text-wheat font-semibold">NC Farm Stress Hotline</p>
            <p className="text-wheat/60 text-sm">1-800-555-3473</p>
          </div>
          <div className="rounded-2xl border border-growth/30 bg-growth/10 p-5">
            <p className="text-growth font-mono text-xs uppercase tracking-widest mb-2">Federal Help</p>
            <p className="text-wheat font-semibold">USDA Service Center Finder</p>
            <p className="text-wheat/60 text-sm">Find your nearest appointment office</p>
          </div>
          <div className="rounded-2xl border border-wheat/20 bg-soil/60 p-5">
            <p className="text-ember font-mono text-xs uppercase tracking-widest mb-2">Prep Faster</p>
            <p className="text-wheat font-semibold">Application Toolkit</p>
            <Link href="/resources" className="text-wheat/70 text-sm hover:text-wheat">
              Open resources →
            </Link>
          </div>
        </div>
        
        {/* Local Extension Offices */}
        <div className="mt-16 pt-16 border-t border-wheat/10">
          <h2 className="font-display text-2xl font-bold text-wheat mb-6 text-center">Local Agricultural Extension Offices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['Sampson', 'Duplin', 'Wayne', 'Johnston'].map(county => (
              <div key={county} className="bg-ash border border-wheat/5 p-6 rounded-2xl text-center hover:border-growth/30 transition-colors cursor-pointer">
                <h3 className="font-body font-bold text-wheat mb-1">{county} County</h3>
                <p className="text-wheat/50 text-xs font-mono">View Contact Info →</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
