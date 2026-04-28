import type { SupabaseClient } from '@supabase/supabase-js'

import type { CountyRisk, MapOverlay } from '@/components/maps/CountyReliefMapSection'
import { fetchNcLiveDisasterSignals, type LiveDisasterSignal } from '@/lib/data/liveNcDisasterSignals'
import { getCountyCentroid, NC_COUNTY_FIPS_ORDERED } from '@/lib/data/ncCountyCentroids'
import { getNcCountyShortNameForFips } from '@/lib/data/ncCountyLabelsByFips'
import { getZipsForNcCountyName } from '@/lib/data/ncCountyZipsLookup'

function mergeZipLists(...lists: (string[] | undefined)[]): string[] {
  const set = new Set<string>()
  for (const list of lists) {
    for (const z of list ?? []) {
      const t = String(z ?? '').trim()
      if (t.length === 5 && /^\d{5}$/.test(t)) set.add(t)
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function buildZipsByCountyFips(rows: { zip_code: string; county_fips: string | null }[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const row of rows) {
    const fips = row.county_fips?.trim()
    const zip = String(row.zip_code ?? '').trim()
    if (!fips || zip.length !== 5) continue
    const arr = map.get(fips) ?? []
    arr.push(zip)
    map.set(fips, arr)
  }
  return map
}

function toNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

/** North Carolina county FIPS are state 37 + 3-digit county code (US Census). */
function isNcCountyFips(fips: string): boolean {
  return /^37\d{3}$/.test(fips.trim())
}

/**
 * Load every NC ZIP row from PostgREST (chunked). Default `.select()` caps at ~1000 rows;
 * NC has ~800+ ZIP rows — chunking avoids silent truncation if the limit changes.
 */
async function fetchAllNcZipCodeRows(supabase: SupabaseClient): Promise<{ zip_code: string; county_fips: string | null }[]> {
  const pageSize = 1000
  const rows: { zip_code: string; county_fips: string | null }[] = []
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('nc_zip_codes')
      .select('zip_code, county_fips')
      .eq('state_abbr', 'NC')
      .order('zip_code')
      .range(from, from + pageSize - 1)
    if (error) break
    if (!data?.length) break
    rows.push(...(data as typeof rows))
    if (data.length < pageSize) break
  }
  return rows
}

export type HomeStat = {
  label: string
  value: number
  suffix: string
  decimals?: number
}

export type HomePagePayload = {
  stats: HomeStat[]
  counties: CountyRisk[]
  overlays: MapOverlay[]
}

function toUtcDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10)
}

async function syncRainfallDeficitMetricsToDatabase(
  supabase: SupabaseClient,
  avgDeficitInches: number,
  countyCountWithDeficit: number
): Promise<void> {
  if (!Number.isFinite(avgDeficitInches) || countyCountWithDeficit <= 0) return

  try {
    const date = toUtcDateOnly(new Date())
    const rows = [
      {
        date,
        metric_name: 'nc_avg_rainfall_deficit_inches',
        value: avgDeficitInches,
        unit: 'inches',
        source: 'FarmBridge counties table',
      },
      {
        date,
        metric_name: 'nc_counties_with_rainfall_deficit',
        value: countyCountWithDeficit,
        unit: 'counties',
        source: 'FarmBridge counties table',
      },
    ]

    const { error } = await supabase
      .from('crisis_metrics')
      .upsert(rows, { onConflict: 'date,metric_name', ignoreDuplicates: false })
    if (error) {
      console.warn('Failed to sync rainfall deficit metrics:', error.message)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    console.warn('Failed to initialize rainfall metric sync:', message)
  }
}

async function fetchLatestRainfallDeficitMetric(supabase: SupabaseClient): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('crisis_metrics')
      .select('value')
      .eq('metric_name', 'nc_avg_rainfall_deficit_inches')
      .order('date', { ascending: false })
      .limit(120)

    if (error) return null

    let latestFinite: number | null = null
    for (const row of data ?? []) {
      const value = toNullableNumber(row.value)
      if (value === null) continue
      if (latestFinite === null) latestFinite = value
      if (Math.abs(value) > 0) return Math.round(value * 10) / 10
    }

    return latestFinite !== null ? Math.round(latestFinite * 10) / 10 : null
  } catch {
    return null
  }
}

function fallbackCountyRowFromFips(fips: string): Record<string, unknown> {
  const shortName = getNcCountyShortNameForFips(fips)
  return {
    fips_code: fips,
    name: shortName ? `${shortName} County` : fips,
    lat: null,
    lng: null,
    drought_level: null,
    precipitation_deficit_inches: null,
    is_primary_disaster_area: null,
    is_contiguous_disaster_area: null,
    disaster_number: null,
    disaster_declaration_date: null,
    topsoil_moisture: null,
    updated_at: null,
  }
}

function mapCountyRow(
  row: Record<string, unknown>,
  zipByFips: Map<string, string[]>,
  liveDisaster: LiveDisasterSignal | null
): CountyRisk | null {
  const fips = String(row.fips_code ?? '')
  const centroid = getCountyCentroid(fips)
  const lat = toNullableNumber(row.lat) ?? centroid?.lat ?? null
  const lng = toNullableNumber(row.lng) ?? centroid?.lng ?? null
  const precipitationDeficitInches = toNullableNumber(row.precipitation_deficit_inches)

  const name = String(row.name ?? '')
  return {
    name,
    fipsCode: fips,
    stateAbbr: 'NC',
    lat,
    lng,
    zipCodes: mergeZipLists(zipByFips.get(fips), getZipsForNcCountyName(name)),
    droughtLevel: row.drought_level != null ? String(row.drought_level) : null,
    precipitationDeficitInches,
    isPrimaryDisasterArea:
      liveDisaster?.isDisasterRelated ??
      (typeof row.is_primary_disaster_area === 'boolean' ? row.is_primary_disaster_area : null),
    isContiguousDisasterArea:
      liveDisaster?.isDisasterRelated ??
      (typeof row.is_contiguous_disaster_area === 'boolean' ? row.is_contiguous_disaster_area : null),
    disasterNumber:
      liveDisaster?.disasterNumber ?? (row.disaster_number != null ? String(row.disaster_number) : null),
    disasterDeclarationDate: liveDisaster?.disasterDeclarationDate ?? (row.disaster_declaration_date != null ? String(row.disaster_declaration_date) : null),
    topsoilMoisture: row.topsoil_moisture != null ? String(row.topsoil_moisture) : null,
    updatedAt: row.updated_at != null ? String(row.updated_at) : null,
  }
}

function mapVolunteerListing(
  row: Record<string, unknown>,
  countyNameByFips: Map<string, string>
): MapOverlay | null {
  const id = row.id != null ? String(row.id) : null
  if (!id) return null
  const fips = row.county_fips != null ? String(row.county_fips) : null
  if (fips && !isNcCountyFips(fips)) return null
  const centroid = getCountyCentroid(fips)

  return {
    id,
    locationType: 'listing',
    title: String(row.title ?? 'Volunteer listing'),
    countyName: fips ? countyNameByFips.get(fips) ?? 'North Carolina' : 'North Carolina',
    countyFips: fips,
    countyLat: centroid?.lat ?? null,
    countyLng: centroid?.lng ?? null,
    zipCode: row.zip_code != null ? String(row.zip_code) : null,
    contactName: row.contact_name != null ? String(row.contact_name) : null,
    contactEmail: row.contact_email != null ? String(row.contact_email) : null,
    contactPhone: row.contact_phone != null ? String(row.contact_phone) : null,
    address: row.address != null ? String(row.address) : null,
    city: row.city != null ? String(row.city) : null,
    state: row.state != null ? String(row.state) : null,
    createdAt: row.created_at != null ? String(row.created_at) : null,
  }
}

export async function buildHomePayload(supabase: SupabaseClient): Promise<HomePagePayload> {
  const [countiesRes, listingsRes, zipRows, activeProgramsRes, urgentProgramsRes, liveDisasterSignals, latestDeficitMetric] = await Promise.all([
    supabase.from('counties').select('*').like('fips_code', '37%'),
    supabase.from('volunteer_listings').select('*').eq('status', 'open').limit(50),
    fetchAllNcZipCodeRows(supabase),
    supabase.from('programs').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('programs').select('id', { count: 'exact', head: true }).eq('active', true).eq('is_urgent', true),
    fetchNcLiveDisasterSignals(),
    fetchLatestRainfallDeficitMetric(supabase),
  ])

  const countyRows = ((countiesRes.data ?? []) as Record<string, unknown>[]).filter((r) =>
    isNcCountyFips(String(r.fips_code ?? ''))
  )
  const countyRowByFips = new Map<string, Record<string, unknown>>()
  for (const r of countyRows) {
    const fips = String(r.fips_code ?? '').trim()
    if (isNcCountyFips(fips)) countyRowByFips.set(fips, r)
  }

  const countyNameByFips = new Map(
    NC_COUNTY_FIPS_ORDERED.map((fips) => {
      const row = countyRowByFips.get(fips)
      const label = row ? String(row.name ?? '') : `${getNcCountyShortNameForFips(fips)} County`
      return [fips, label || 'North Carolina'] as const
    })
  )

  const zipByFips = buildZipsByCountyFips(zipRows)

  const counties: CountyRisk[] = NC_COUNTY_FIPS_ORDERED.map((fips) =>
    mapCountyRow(
      countyRowByFips.get(fips) ?? fallbackCountyRowFromFips(fips),
      zipByFips,
      liveDisasterSignals.byCountyFips.get(fips) ?? null
    )
  ).filter((c): c is CountyRisk => c !== null && c.lat !== null && c.lng !== null)

  const listingRows = (listingsRes.data ?? []) as Record<string, unknown>[]
  const overlays: MapOverlay[] = listingRows
    .map((r) => mapVolunteerListing(r, countyNameByFips))
    .filter((o): o is MapOverlay => o !== null && o.countyLat !== null && o.countyLng !== null)

  const activePrograms = activeProgramsRes.count ?? 0
  const urgentPrograms = urgentProgramsRes.count ?? 0

  let disasterCount = 0
  let deficitSum = 0
  let deficitN = 0
  for (const county of counties) {
    const primary = county.isPrimaryDisasterArea === true
    const contiguous = county.isContiguousDisasterArea === true
    if (primary || contiguous) disasterCount += 1
    if (typeof county.precipitationDeficitInches === 'number') {
      deficitSum += county.precipitationDeficitInches
      deficitN += 1
    }
  }

  const avgDeficitFromCounties = deficitN > 0 ? Math.round((deficitSum / deficitN) * 10) / 10 : null
  const avgDeficit = avgDeficitFromCounties ?? latestDeficitMetric ?? 0
  await syncRainfallDeficitMetricsToDatabase(supabase, avgDeficit, deficitN)

  const stats: HomeStat[] = [
    { label: 'ACTIVE PROGRAMS', value: activePrograms, suffix: '' },
    { label: 'URGENT DEADLINES', value: urgentPrograms, suffix: '' },
    { label: 'DISASTER-RELATED COUNTIES', value: disasterCount, suffix: '' },
    { label: 'AVG RAINFALL DEFICIT', value: avgDeficit, suffix: ' in', decimals: 1 },
  ]

  return {
    stats,
    counties,
    overlays,
  }
}
