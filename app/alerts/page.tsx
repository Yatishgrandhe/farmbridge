import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ALERT_LEVEL_STYLES } from '@/lib/constants/alertLevels'
import { Badge } from '@/components/ui/Badge'

export default async function AlertsPage() {
  const supabase = await createServerClient()
  const { data: counties } = await supabase
    .from('counties')
    .select('name, drought_level, is_primary_disaster_area, is_contiguous_disaster_area, precipitation_deficit_inches')
    .order('updated_at', { ascending: false })
    .limit(8)

  const countyAlerts = (counties ?? []).map((county) => {
    const isHigh = county.drought_level === 'extreme' || county.is_primary_disaster_area
    const isMedium = county.drought_level === 'severe' || county.is_contiguous_disaster_area
    const level = isHigh ? 'High' : isMedium ? 'Medium' : 'Watch'
    const deficit = county.precipitation_deficit_inches ?? 0

    return {
      county: county.name,
      level,
      issue: `${county.drought_level ?? 'unknown'} drought • ${deficit.toFixed(1)}" deficit`,
      action: isHigh
        ? 'Prioritize urgent relief applications this week'
        : isMedium
          ? 'Prepare documents and pre-submit eligibility profile'
          : 'Monitor county updates and maintain readiness packet',
    }
  })

  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-3xl mb-12 animate-fade-in-soft">
          <span className="text-crisis font-mono text-xs uppercase tracking-widest">County Monitor</span>
          <h1 className="font-display text-5xl text-wheat font-bold mt-3 mb-4">Live Relief Alerts</h1>
          <p className="text-wheat/70 leading-relaxed">
            Track county-level urgency signals, funding pressure, and appointment constraints so your
            farm can prioritize submissions before windows close.
          </p>
        </div>

        <div className="space-y-4 mb-14">
          {countyAlerts.length === 0 && (
            <div className="rounded-2xl border border-wheat/10 bg-soil/40 px-5 py-8 text-center">
              <p className="text-wheat/85 font-semibold">No live alerts available right now.</p>
              <p className="text-wheat/65 text-sm mt-1">
                Check back shortly for updated county risk and deadline signals.
              </p>
            </div>
          )}
          {countyAlerts.map((alert, index) => (
            <article
              key={`${alert.county}-${alert.issue}`}
              aria-labelledby={`alert-county-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="rounded-2xl border border-wheat/10 bg-soil/50 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-soft hover:border-ember/45 hover:-translate-y-0.5 transition-all"
            >
              <div className="space-y-1">
                <h2 id={`alert-county-${index}`} className="text-wheat font-semibold text-base">
                  {alert.county} County
                </h2>
                <p className="text-wheat/70 text-sm">{alert.issue}</p>
                <p className="text-ember text-sm">Recommended action: {alert.action}</p>
              </div>
              <Badge className={`border w-fit animate-pulse ${ALERT_LEVEL_STYLES[alert.level]}`}>{alert.level}</Badge>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border border-wheat/10 bg-ash/60 p-8 animate-fade-in-soft animate-delay-300">
          <h2 className="font-display text-3xl text-wheat mb-3">What to do after an alert</h2>
          <ul className="grid md:grid-cols-3 gap-3 text-sm">
            <li className="p-4 rounded-xl border border-wheat/10 text-wheat/75 bg-soil/40">
              Verify county designation and qualifying event dates.
            </li>
            <li className="p-4 rounded-xl border border-wheat/10 text-wheat/75 bg-soil/40">
              Confirm required documents in the resources toolkit.
            </li>
            <li className="p-4 rounded-xl border border-wheat/10 text-wheat/75 bg-soil/40">
              Submit through your top-priority program list immediately.
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/programs?urgent=true" className="px-5 py-2.5 rounded-lg bg-crisis text-parchment text-sm font-semibold">
              Browse Urgent Programs
            </Link>
            <Link href="/resources" className="px-5 py-2.5 rounded-lg border border-wheat/20 text-wheat text-sm">
              Open Toolkit
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
