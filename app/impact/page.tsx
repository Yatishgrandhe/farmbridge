import Link from 'next/link'
import { DataChart } from '@/components/ui/DataChart'
import { createServerClient } from '@/lib/supabase/server'

export default async function ImpactPage() {
  const supabase = await createServerClient()
  const [{ data: counties }, { data: programs }, { data: metrics }] = await Promise.all([
    supabase
      .from('counties')
      .select('drought_level, precipitation_deficit_inches, is_primary_disaster_area'),
    supabase.from('programs').select('category, is_urgent, active').eq('active', true),
    supabase
      .from('crisis_metrics')
      .select('date,metric_name,value')
      .in('metric_name', ['nc_drought_coverage_pct', 'urea_price_per_ton'])
      .gte('date', '2025-01-01')
      .order('date', { ascending: true }),
  ])

  const droughtBuckets = ['moderate', 'severe', 'extreme']
  const droughtData = droughtBuckets.map((level) => ({
    label: `${level.charAt(0).toUpperCase()}${level.slice(1)}`,
    value: (counties ?? []).filter((county) => county.drought_level === level).length,
  }))

  const avgDeficitByLevel = droughtBuckets.map((level) => {
    const deficits = (counties ?? [])
      .filter((county) => county.drought_level === level)
      .map((county) => county.precipitation_deficit_inches ?? 0)
      .filter((value) => typeof value === 'number' && Number.isFinite(value))
    const avg = deficits.length > 0 ? deficits.reduce((sum, n) => sum + n, 0) / deficits.length : 0
    return { label: `${level.charAt(0).toUpperCase()}${level.slice(1)}`, value: Number(avg.toFixed(2)) }
  })

  const primaryDisasterCount =
    (counties ?? []).filter((county) => county.is_primary_disaster_area).length ?? 0
  const urgentProgramCount = (programs ?? []).filter((program) => program.is_urgent).length ?? 0
  const activeProgramCount = programs?.length ?? 0
  const metricRows = metrics ?? []
  const droughtCoverageSeries = metricRows
    .filter((row) => row.metric_name === 'nc_drought_coverage_pct')
    .map((row) => ({ label: row.date?.slice(0, 7) ?? 'N/A', value: Number(row.value) }))
  const ureaSeries = metricRows
    .filter((row) => row.metric_name === 'urea_price_per_ton')
    .map((row) => ({ label: row.date?.slice(0, 7) ?? 'N/A', value: Number(row.value) }))

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-crisis font-mono text-sm uppercase tracking-widest mb-4 block">State of Emergency</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-wheat mb-6">
            Live North Carolina Impact Data
          </h1>
          <p className="text-wheat/70 font-body text-xl max-w-2xl mx-auto leading-relaxed">
            Metrics below are sourced from your Supabase tables and update as county and program
            records change.
          </p>
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-soil/50 border border-wheat/10 p-5">
              <p className="text-wheat/60 text-xs uppercase tracking-widest font-mono">Primary Disaster Counties</p>
              <p className="text-wheat font-display text-4xl mt-2">{primaryDisasterCount}</p>
            </div>
            <div className="rounded-2xl bg-soil/50 border border-wheat/10 p-5">
              <p className="text-wheat/60 text-xs uppercase tracking-widest font-mono">Active Programs</p>
              <p className="text-wheat font-display text-4xl mt-2">{activeProgramCount}</p>
            </div>
            <div className="rounded-2xl bg-soil/50 border border-wheat/10 p-5">
              <p className="text-wheat/60 text-xs uppercase tracking-widest font-mono">Urgent Programs</p>
              <p className="text-wheat font-display text-4xl mt-2">{urgentProgramCount}</p>
            </div>
          </div>

          <DataChart
            title="County Drought Severity Distribution"
            data={droughtData}
            xAxisKey="label"
            yAxisKey="value"
            type="bar"
            color="var(--color-crisis)"
            height={340}
          />

          <DataChart
            title="Average Rainfall Deficit by Drought Level (inches)"
            data={avgDeficitByLevel}
            xAxisKey="label"
            yAxisKey="value"
            type="line"
            color="var(--color-ember)"
            height={340}
          />

          <DataChart
            title="NC Drought Coverage (%)"
            data={droughtCoverageSeries}
            xAxisKey="label"
            yAxisKey="value"
            type="line"
            color="var(--color-growth)"
            height={320}
          />

          <DataChart
            title="Urea Price per Ton (USD)"
            data={ureaSeries}
            xAxisKey="label"
            yAxisKey="value"
            type="area"
            color="var(--color-crisis)"
            height={320}
          />
        </div>

        <div className="mt-20 text-center bg-growth/20 border border-growth/30 rounded-2xl p-10">
          <h3 className="font-display text-2xl font-bold text-wheat mb-4">
            These metrics refresh directly from your database.
          </h3>
          <p className="text-wheat/80 font-body mb-8 max-w-xl mx-auto">
            Use the live program list to convert risk signals into applications farmers can submit
            right now.
          </p>
          <Link
            href="/programs"
            className="inline-block px-8 py-4 bg-growth text-parchment font-body font-semibold rounded-full text-sm tracking-wide transition-all hover:bg-growth/80"
          >
            Find Relief Programs
          </Link>
        </div>
      </div>
    </div>
  )
}
