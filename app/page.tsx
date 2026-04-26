import { HeroSection } from '@/components/sections/HeroSection'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { WebGLFarmScene } from '@/components/3d/WebGLFarmScene'
import { SplineShowcase } from '@/components/3d/SplineShowcase'
import { CountyReliefMapSection } from '@/components/maps/CountyReliefMapSection'

const QUICK_PATHS = [
  {
    title: 'I need urgent relief',
    description: 'See programs with closing windows in the next 30 days and prioritize first actions.',
    href: '/alerts',
    cta: 'View urgent alerts',
  },
  {
    title: 'I want to check eligibility',
    description: 'Answer a few questions and receive tailored program recommendations by county and farm type.',
    href: '/eligibility',
    cta: 'Start eligibility wizard',
  },
  {
    title: 'I need help with paperwork',
    description: 'Use templates, checklist packets, and office-hour links built for first-time applicants.',
    href: '/resources',
    cta: 'Open application toolkit',
  },
]

const ACTION_STEPS = [
  'Run eligibility check and save top 3 programs.',
  'Collect tax, acreage, and yield-loss documents.',
  'Book county extension support if forms are stalled.',
  'Track deadlines and submit with proof of receipt.',
]

const DATASET_LINKS = [
  {
    name: 'NC OneMap County Boundary Polygons',
    href: 'https://www.nconemap.gov/datasets/NCEM-GIS::north-carolina-state-and-county-boundary-polygons',
  },
  {
    name: 'U.S. Drought Monitor Data Downloads',
    href: 'https://droughtmonitor.unl.edu/Data.aspx',
  },
  {
    name: 'Drought.gov County Data Explorer',
    href: 'https://www.drought.gov/county/data',
  },
]

export default async function Home() {
  const supabase = await createServerClient()

  const [
    { count: activeProgramsCount },
    { count: urgentProgramsCount },
    { count: primaryDisasterCount },
    { count: severeDroughtCount },
    { data: countiesWithDeficit },
    { data: countyRiskRows },
  ] = await Promise.all([
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase
      .from('programs')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
      .eq('is_urgent', true),
    supabase
      .from('counties')
      .select('*', { count: 'exact', head: true })
      .eq('is_primary_disaster_area', true),
    supabase
      .from('counties')
      .select('*', { count: 'exact', head: true })
      .in('drought_level', ['severe', 'extreme']),
    supabase.from('counties').select('precipitation_deficit_inches'),
    supabase
      .from('counties')
      .select('name,fips_code,drought_level,precipitation_deficit_inches,is_primary_disaster_area,is_contiguous_disaster_area,disaster_number,disaster_declaration_date,topsoil_moisture,updated_at')
      .order('updated_at', { ascending: false })
      .limit(20),
  ])

  const precipitationDeficits = (countiesWithDeficit ?? [])
    .map((county) => county.precipitation_deficit_inches ?? 0)
    .filter((value) => typeof value === 'number' && Number.isFinite(value))
  const averageDeficitInches =
    precipitationDeficits.length > 0
      ? precipitationDeficits.reduce((total, value) => total + value, 0) / precipitationDeficits.length
      : 0

  const liveHeroStats = [
    {
      value: activeProgramsCount ?? 0,
      suffix: '',
      label: 'active relief\nprograms in database',
      prefix: '',
    },
    {
      value: urgentProgramsCount ?? 0,
      suffix: '',
      label: 'urgent programs\nneeding quick action',
      prefix: '',
    },
    {
      value: primaryDisasterCount ?? 0,
      suffix: '',
      label: 'primary disaster\ncounties in NC',
      prefix: '',
    },
    {
      value: averageDeficitInches,
      suffix: ' in',
      label: 'average county\nrainfall deficit',
      prefix: '',
    },
  ]

  return (
    <main>
      <HeroSection stats={liveHeroStats} />

      <section className="container mx-auto px-6 py-18">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="space-y-4">
            <span className="text-growth font-mono text-xs uppercase tracking-widest">Live Operations View</span>
            <h2 className="font-display text-4xl text-wheat font-bold">Interactive risk overview for fast decisions</h2>
            <p className="text-wheat/70">
              Use this live visual panel to quickly understand changing pressure across counties and
              prioritize where applications and support efforts should move first.
            </p>
            <WebGLFarmScene />
          </div>
          <div className="space-y-4">
            <span className="text-ember font-mono text-xs uppercase tracking-widest">Scenario Spotlight</span>
            <h3 className="font-display text-3xl text-wheat font-bold">Explore the current response picture</h3>
            <p className="text-wheat/65 text-sm">
              This animated spotlight helps teams communicate urgency and keep county leaders aligned
              on response priorities in a single glance.
            </p>
            <SplineShowcase />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-18">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-crisis font-mono text-xs uppercase tracking-widest">County Intelligence Map</span>
            <h3 className="font-display text-3xl text-wheat font-bold">Filter by ZIP and open county detail cards</h3>
            <p className="text-wheat/65 text-sm">
              Click markers to view county popups, then open full details with drought status, deficit,
              disaster fields, and representative ZIP coverage for planning.
            </p>
            <CountyReliefMapSection
              counties={(countyRiskRows ?? []).map((county) => ({
                name: county.name,
                fipsCode: county.fips_code,
                droughtLevel: county.drought_level,
                precipitationDeficitInches: county.precipitation_deficit_inches,
                isPrimaryDisasterArea: county.is_primary_disaster_area,
                isContiguousDisasterArea: county.is_contiguous_disaster_area,
                disasterNumber: county.disaster_number,
                disasterDeclarationDate: county.disaster_declaration_date,
                topsoilMoisture: county.topsoil_moisture,
                updatedAt: county.updated_at,
              }))}
            />
          </div>
          <div className="rounded-2xl border border-wheat/10 bg-soil/50 p-6">
            <h4 className="font-display text-2xl text-wheat mb-3">Open datasets used</h4>
            <p className="text-wheat/70 text-sm mb-4">
              Trusted public sources that support county boundaries, drought signals, and response context.
            </p>
            <ul className="space-y-3">
              {DATASET_LINKS.map((dataset) => (
                <li key={dataset.href}>
                  <a
                    href={dataset.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ember hover:text-wheat transition-colors underline underline-offset-4"
                  >
                    {dataset.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mb-10 animate-fade-in-soft">
          <span className="text-growth font-mono text-xs uppercase tracking-widest">Quick Start</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-wheat mt-3 mb-3">
            Pick a path and move in minutes.
          </h2>
          <p className="text-wheat/70">
            FarmBridge is designed for active farming schedules. Start with one outcome and we
            guide the next actions with local context. Currently tracking{' '}
            <span className="text-ember font-semibold">{severeDroughtCount ?? 0}</span> counties
            with severe or extreme drought conditions.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {QUICK_PATHS.map((path, index) => (
            <Link
              key={path.title}
              href={path.href}
              style={{ animationDelay: `${index * 0.12}s` }}
              className="bg-soil/50 border border-wheat/10 rounded-2xl p-6 hover:border-growth/40 hover:-translate-y-1 transition-all animate-fade-in-soft"
            >
              <h3 className="font-display text-2xl text-wheat font-semibold mb-2">{path.title}</h3>
              <p className="text-wheat/65 text-sm leading-relaxed mb-5">{path.description}</p>
              <span className="text-growth text-sm font-semibold">{path.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24 animate-fade-in-soft [animation-delay:240ms]">
        <div className="rounded-3xl border border-growth/30 bg-growth/10 p-8 md:p-10 grid md:grid-cols-2 gap-8">
          <div>
            <span className="text-ember font-mono text-xs uppercase tracking-widest">Submission Flow</span>
            <h3 className="font-display text-3xl text-wheat font-bold mt-3 mb-3">
              A simple operating rhythm for relief applications
            </h3>
            <p className="text-wheat/75 text-sm leading-relaxed">
              Most rejected applications fail on missing records or late deadlines. This checklist
              keeps teams aligned even during planting and harvest peaks.
            </p>
          </div>
          <ol className="space-y-3">
            {ACTION_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-3 bg-ash/50 rounded-xl p-3 border border-wheat/10">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-wheat text-ash text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-wheat/80 text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
