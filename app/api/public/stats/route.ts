import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { fetchNcLiveDisasterSignals } from '@/lib/data/liveNcDisasterSignals'

export const revalidate = 60

function toNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

export async function GET() {
  const supabase = await createServerClient()

  const [{ count: activePrograms, error: programsError }, { data: countyRows, error: countiesError }, liveDisaster] =
    await Promise.all([
      supabase
        .from('programs')
        .select('*', { count: 'exact', head: true })
        .eq('active', true),
      supabase
        .from('counties')
        .select('fips_code, precipitation_deficit_inches, updated_at')
        .like('fips_code', '37%'),
      fetchNcLiveDisasterSignals(),
    ])

  if (programsError || countiesError) {
    return NextResponse.json(
      {
        error: programsError?.message ?? countiesError?.message ?? 'Failed to load stats',
      },
      { status: 500 }
    )
  }

  const ncRows = countyRows ?? []
  const disasterCountyCount = liveDisaster.byCountyFips.size

  let deficitSum = 0
  let deficitN = 0
  let latestCountyUpdate: string | null = null

  for (const row of ncRows) {
    const deficit = toNullableNumber(row.precipitation_deficit_inches)
    if (deficit !== null) {
      deficitSum += deficit
      deficitN += 1
    }
    if (row.updated_at && (!latestCountyUpdate || row.updated_at > latestCountyUpdate)) {
      latestCountyUpdate = row.updated_at
    }
  }

  const averageRainfallDeficitInches = deficitN > 0 ? Math.round((deficitSum / deficitN) * 10) / 10 : null

  return NextResponse.json({
    programCount: activePrograms ?? 0,
    disasterRelatedCountyCount: disasterCountyCount,
    averageRainfallDeficitInches,
    countyRowsUsedForDeficit: deficitN,
    dataFreshness: {
      countiesUpdatedAt: latestCountyUpdate,
      femaLastRefresh: liveDisaster.asOf,
    },
    sources: [
      {
        name: 'OpenFEMA Disaster Declarations Summaries v2',
        url: 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries',
      },
      {
        name: 'FarmBridge counties table (precipitation deficit)',
        table: 'public.counties',
      },
    ],
  })
}
