import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ResourceSubmissionForm } from '@/components/resources/ResourceSubmissionForm'

export default async function ResourcesPage() {
  const supabase = await createServerClient()
  const [{ count: liveResourceCount }, { data: resources }] = await Promise.all([
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('name,type,notes,hours,website_url').limit(24),
  ])
  const officeHours = (resources ?? [])
    .filter((resource) => resource.hours)
    .slice(0, 3)
    .map((resource) => ({
      day: resource.name,
      window: resource.hours ?? 'Business hours',
      topic: resource.notes ?? 'Local support',
    }))

  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-3xl mb-12 animate-fade-in-soft">
          <span className="text-growth font-mono text-xs uppercase tracking-widest">Resource Center</span>
          <h1 className="font-display text-5xl text-wheat font-bold mt-3 mb-4">Resources That Save Filing Time</h1>
          <p className="text-wheat/70 leading-relaxed">
            Use local support listings and office-hour guidance designed around US drought-response
            applications. Database currently tracks{' '}
            <span className="text-ember font-semibold">{liveResourceCount ?? 0}</span> local resource records.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-soft animate-delay-300">
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

        <div className="mt-12 animate-fade-in-soft animate-delay-420">
          <ResourceSubmissionForm />
        </div>
      </div>
    </main>
  )
}
