import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

const TOOLKITS = [
  {
    title: 'Disaster Relief Packet',
    items: ['Loss verification worksheet', 'County declaration lookup', 'Program intake script'],
  },
  {
    title: 'Loan Readiness Packet',
    items: ['Cash flow snapshot template', 'Debt schedule worksheet', 'Collateral prep checklist'],
  },
  {
    title: 'Conservation Upgrade Packet',
    items: ['Cost-share estimate form', 'Water infrastructure planner', 'Soil remediation guide'],
  },
]

const DEFAULT_OFFICE_HOURS = [
  { day: 'Monday', window: '7:00 PM - 8:30 PM ET', topic: 'First-time USDA applicants' },
  { day: 'Wednesday', window: '12:00 PM - 1:00 PM ET', topic: 'SBA disaster loan Q&A' },
  { day: 'Friday', window: '8:00 AM - 9:00 AM ET', topic: 'Deadline sprint clinic' },
]

export default async function ResourcesPage() {
  const supabase = await createServerClient()
  const { count: liveResourceCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
  const officeHours = DEFAULT_OFFICE_HOURS

  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-3xl mb-12 animate-fade-in-soft">
          <span className="text-growth font-mono text-xs uppercase tracking-widest">Application Toolkit</span>
          <h1 className="font-display text-5xl text-wheat font-bold mt-3 mb-4">Resources That Save Filing Time</h1>
          <p className="text-wheat/70 leading-relaxed">
            Download practical templates, follow submission checklists, and use guided prep
            materials designed around NC drought-response applications. Database currently tracks{' '}
            <span className="text-ember font-semibold">{liveResourceCount ?? 0}</span> local resource records.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {TOOLKITS.map((toolkit, index) => (
            <article
              key={toolkit.title}
              style={{ animationDelay: `${index * 0.14}s` }}
              className="rounded-2xl bg-soil/50 border border-wheat/10 p-6 animate-fade-in-soft hover:-translate-y-1 hover:border-growth/35 transition-all"
            >
              <h2 className="text-wheat font-display text-2xl mb-4">{toolkit.title}</h2>
              <ul className="space-y-2">
                {toolkit.items.map((item) => (
                  <li key={item} className="text-wheat/70 text-sm">- {item}</li>
                ))}
              </ul>
              <button className="mt-6 px-4 py-2 rounded-lg bg-wheat/10 text-wheat text-sm hover:bg-wheat/20 transition-colors animate-float-gentle">
                Download Toolkit
              </button>
            </article>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-soft [animation-delay:300ms]">
          <section className="rounded-2xl border border-wheat/10 p-6 bg-ash/60 hover:border-wheat/25 transition-colors">
            <h2 className="font-display text-3xl text-wheat mb-3">Weekly Office Hours</h2>
            <p className="text-wheat/60 text-sm mb-5">
              Join live sessions with volunteer advisers for application troubleshooting.
            </p>
            <div className="space-y-3">
              {officeHours.map((session) => (
                <div key={session.day} className="p-3 rounded-lg border border-wheat/10 bg-soil/40">
                  <p className="text-wheat font-semibold">{session.day}</p>
                  <p className="text-wheat/60 text-sm">{session.window}</p>
                  <p className="text-growth text-sm">{session.topic}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-growth/30 p-6 bg-growth/10 hover:border-ember/40 transition-colors">
            <h2 className="font-display text-3xl text-wheat mb-3">Need personalized guidance?</h2>
            <p className="text-wheat/75 text-sm leading-relaxed mb-6">
              Start with eligibility to generate a focused shortlist, then contact support with your
              pre-filled context to avoid repeating details.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/eligibility" className="px-5 py-2.5 rounded-lg bg-wheat text-ash font-semibold text-sm">
                Run Eligibility
              </Link>
              <Link href="/support" className="px-5 py-2.5 rounded-lg border border-wheat/25 text-wheat text-sm">
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
