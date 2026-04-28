import type { SupabaseClient } from '@supabase/supabase-js'

import type { CountyRisk, MapOverlay } from '@/components/maps/CountyReliefMapSection'
import { getCountyCentroid } from '@/lib/data/ncCountyCentroids'
import { getZipsForNcCountyName } from '@/lib/data/ncCountyZipsLookup'

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

function mapCountyRow(row: Record<string, unknown>): CountyRisk | null {
  const fips = String(row.fips_code ?? '')
  const centroid = getCountyCentroid(fips)
  const lat =
    typeof row.lat === 'number' ? row.lat : centroid?.lat ?? null
  const lng =
    typeof row.lng === 'number' ? row.lng : centroid?.lng ?? null

  const name = String(row.name ?? '')
  return {
    name,
    fipsCode: fips,
    stateAbbr: 'NC',
    lat,
    lng,
    zipCodes: getZipsForNcCountyName(name),
    droughtLevel: row.drought_level != null ? String(row.drought_level) : null,
    precipitationDeficitInches:
      typeof row.precipitation_deficit_inches === 'number'
        ? row.precipitation_deficit_inches
        : null,
    isPrimaryDisasterArea:
      typeof row.is_primary_disaster_area === 'boolean' ? row.is_primary_disaster_area : null,
    isContiguousDisasterArea:
      typeof row.is_contiguous_disaster_area === 'boolean' ? row.is_contiguous_disaster_area : null,
    disasterNumber: row.disaster_number != null ? String(row.disaster_number) : null,
    disasterDeclarationDate:
      row.disaster_declaration_date != null ? String(row.disaster_declaration_date) : null,
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
  const [countiesRes, listingsRes, activeProgramsRes, urgentProgramsRes] = await Promise.all([
    supabase.from('counties').select('*'),
    supabase.from('volunteer_listings').select('*').eq('status', 'open').limit(50),
    supabase.from('programs').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('programs').select('id', { count: 'exact', head: true }).eq('active', true).eq('is_urgent', true),
  ])

  const countyRows = (countiesRes.data ?? []) as Record<string, unknown>[]
  const countyNameByFips = new Map(countyRows.map((r) => [String(r.fips_code ?? ''), String(r.name ?? '')]))

  const counties: CountyRisk[] = countyRows
    .map((r) => mapCountyRow(r))
    .filter((c): c is CountyRisk => c !== null && c.lat !== null && c.lng !== null)

  const listingRows = (listingsRes.data ?? []) as Record<string, unknown>[]
  const overlays: MapOverlay[] = listingRows
    .map((r) => mapVolunteerListing(r, countyNameByFips))
    .filter((o): o is MapOverlay => o !== null && o.countyLat !== null && o.countyLng !== null)

  const activePrograms = activeProgramsRes.count ?? 0
  const urgentPrograms = urgentProgramsRes.count ?? 0

  let disasterCount = 0
  let deficitSum = 0
  let deficitN = 0
  for (const r of countyRows) {
    const primary = r.is_primary_disaster_area === true
    const contiguous = r.is_contiguous_disaster_area === true
    if (primary || contiguous) disasterCount += 1
    if (typeof r.precipitation_deficit_inches === 'number') {
      deficitSum += r.precipitation_deficit_inches
      deficitN += 1
    }
  }

  const avgDeficit = deficitN > 0 ? Math.round((deficitSum / deficitN) * 10) / 10 : 0

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
