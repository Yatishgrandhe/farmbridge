import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { CountyReliefMapSection } from '@/components/maps/CountyReliefMapSection'
import { ScrollAnimator } from '@/components/ui/ScrollAnimator'
import styles from './home.module.css'

const QUICK_PATHS = [
  {
    title: 'I need urgent relief',
    description: 'See programs with closing windows in the next 30 days and prioritize first actions.',
    href: '/alerts',
    cta: 'View urgent alerts',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'I want to check eligibility',
    description: 'Answer a few questions and receive tailored program recommendations by county and farm type.',
    href: '/eligibility',
    cta: 'Start eligibility wizard',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'I need help with paperwork',
    description: 'Use templates, checklist packets, and office-hour links built for first-time applicants.',
    href: '/resources',
    cta: 'Open application toolkit',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80',
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
  { name: 'U.S. Drought Monitor Data Downloads', href: 'https://droughtmonitor.unl.edu/Data.aspx' },
  { name: 'Drought.gov County Data Explorer', href: 'https://www.drought.gov/county/data' },
]

export default async function HomePage() {
  const supabase = await createServerClient()
  const [
    { count: activeProgramsCount },
    { count: urgentProgramsCount },
    { count: primaryDisasterCount },
    { count: severeDroughtCount },
    { data: countiesWithDeficit },
    { data: countyRiskRows },
    { data: listingRows },
    { data: resourceRows },
  ] = await Promise.all([
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('active', true).eq('is_urgent', true),
    supabase.from('counties').select('*', { count: 'exact', head: true }).eq('is_primary_disaster_area', true),
    supabase.from('counties').select('*', { count: 'exact', head: true }).in('drought_level', ['severe', 'extreme']),
    supabase.from('counties').select('precipitation_deficit_inches'),
    supabase
      .from('counties')
      .select('name,fips_code,state_abbr,lat,lng,representative_zip_codes,drought_level,precipitation_deficit_inches,is_primary_disaster_area,is_contiguous_disaster_area,disaster_number,disaster_declaration_date,topsoil_moisture,updated_at')
      .order('name', { ascending: true }),
    supabase
      .from('volunteer_listings')
      .select('id,title,county_fips,address,city,state,zip_code,contact_name,contact_email,contact_phone,created_at,status')
      .eq('status', 'open')
      .limit(60),
    supabase
      .from('resource_submissions')
      .select('id,program_name,county_fips,address,city,state,zip_code,contact_name,contact_email,contact_phone,created_at,status')
      .eq('status', 'approved')
      .limit(60),
  ])

  const countyByFips = new Map((countyRiskRows ?? []).map((county) => [county.fips_code, county]))
  const overlayItems = [
    ...((listingRows ?? []).map((listing) => ({
      id: listing.id,
      locationType: 'listing' as const,
      title: listing.title,
      countyName: countyByFips.get(listing.county_fips)?.name ?? '',
      countyFips: listing.county_fips,
      countyLat: countyByFips.get(listing.county_fips)?.lat ?? null,
      countyLng: countyByFips.get(listing.county_fips)?.lng ?? null,
      zipCode: listing.zip_code ?? null,
      contactName: listing.contact_name ?? null,
      contactEmail: listing.contact_email ?? null,
      contactPhone: listing.contact_phone ?? null,
      address: listing.address ?? null,
      city: listing.city ?? null,
      state: listing.state ?? 'US',
      createdAt: listing.created_at ?? null,
    })) ?? []),
    ...((resourceRows ?? []).map((resource) => ({
      id: resource.id,
      locationType: 'resource_submission' as const,
      title: resource.program_name,
      countyName: countyByFips.get(resource.county_fips)?.name ?? '',
      countyFips: resource.county_fips,
      countyLat: countyByFips.get(resource.county_fips)?.lat ?? null,
      countyLng: countyByFips.get(resource.county_fips)?.lng ?? null,
      zipCode: resource.zip_code ?? null,
      contactName: resource.contact_name ?? null,
      contactEmail: resource.contact_email ?? null,
      contactPhone: resource.contact_phone ?? null,
      address: resource.address ?? null,
      city: resource.city ?? null,
      state: resource.state ?? 'US',
      createdAt: resource.created_at ?? null,
    })) ?? []),
  ].filter((item) => item.countyName)

  const precipitationDeficits = (countiesWithDeficit ?? [])
    .map((county) => county.precipitation_deficit_inches ?? 0)
    .filter((value) => typeof value === 'number' && Number.isFinite(value))
  const averageDeficitInches =
    precipitationDeficits.length > 0 ? precipitationDeficits.reduce((total, value) => total + value, 0) / precipitationDeficits.length : 0

  const stats = [
    { label: 'Active Programs', value: activeProgramsCount ?? 0, suffix: '' },
    { label: 'Urgent Programs', value: urgentProgramsCount ?? 0, suffix: '' },
    { label: 'Primary Disaster Regions', value: primaryDisasterCount ?? 0, suffix: '' },
    { label: 'Avg Rainfall Deficit', value: averageDeficitInches.toFixed(1), suffix: ' in' },
  ]

  return (
    <main>
      <ScrollAnimator />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={`${styles.eyebrow} label`}>US Agriculture Response Platform - Home</p>
          <h1 className={`${styles.heroTitle} display-xl`}>Resilience for the farms that feed every community.</h1>
          <p className={`${styles.heroText} body-lg`}>
            FarmBridge is designed for active farming schedules and county-level urgency decisions. Currently tracking{' '}
            <strong>{severeDroughtCount ?? 0}</strong> counties with severe or extreme drought conditions.
          </p>
          <div className={styles.heroActions}>
            <Link href="/programs" className={styles.primaryButton}>Explore Programs</Link>
            <Link href="/support" className={styles.secondaryButton}>Open Support Center</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.statsBar} animate-on-scroll`}>
        {stats.map((item) => (
          <article key={item.label} className={styles.statCard}>
            <p className={styles.statValue}>{item.value}{item.suffix}</p>
            <p className={`${styles.statLabel} label`}>{item.label}</p>
          </article>
        ))}
      </section>

      <section className={`${styles.quickStart} animate-on-scroll`}>
        <div className={styles.sectionHeader}>
          <p className="label">Quick Start</p>
          <h2 className="display-md">Pick a path and move in minutes.</h2>
        </div>
        <div className={styles.quickGrid}>
          {QUICK_PATHS.map((path) => (
            <Link key={path.title} href={path.href} className={styles.quickCard}>
              <div className={styles.quickImage} style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.72)), url('${path.image}')` }} />
              <div className={styles.quickContent}>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <span>{path.cta} -&gt;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.mapSection} animate-on-scroll`}>
        <div className={styles.mapLeft}>
          <p className="label">County Intelligence Map</p>
          <h2 className="display-md">Filter by ZIP and open county detail cards</h2>
          <p className="body-md">Click markers to view county popups, then open full details with drought status and response context.</p>
          <div className={styles.datasets}>
            {DATASET_LINKS.map((dataset) => (
              <a key={dataset.href} href={dataset.href} target="_blank" rel="noreferrer" className={styles.datasetItem}>
                {dataset.name}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.mapRight}>
          {countyRiskRows && countyRiskRows.length > 0 ? (
            <CountyReliefMapSection
              counties={(countyRiskRows ?? []).map((county) => ({
                name: county.name,
                fipsCode: county.fips_code,
                stateAbbr: county.state_abbr,
                lat: county.lat,
                lng: county.lng,
                zipCodes: county.representative_zip_codes ?? [],
                droughtLevel: county.drought_level,
                precipitationDeficitInches: county.precipitation_deficit_inches,
                isPrimaryDisasterArea: county.is_primary_disaster_area,
                isContiguousDisasterArea: county.is_contiguous_disaster_area,
                disasterNumber: county.disaster_number,
                disasterDeclarationDate: county.disaster_declaration_date,
                topsoilMoisture: county.topsoil_moisture,
                updatedAt: county.updated_at,
              }))}
              overlays={overlayItems}
            />
          ) : (
            <div className={styles.noData}>County map data is currently unavailable.</div>
          )}
        </div>
      </section>

      <section className={`${styles.flowSection} animate-on-scroll`}>
        <p className="label">Submission Flow</p>
        <h2 className="display-md">A simple operating rhythm for relief applications</h2>
        <ol className={styles.flowList}>
          {ACTION_STEPS.map((step, index) => (
            <li key={step} className={styles.flowItem}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
