import raw from '@/lib/data/ncCountyZips.json'
import { NC_COUNTY_FIPS_ORDERED } from '@/lib/data/ncCountyCentroids'

/**
 * NC county labels (HUD / crosswalk JSON keys) in the same order as Census FIPS in
 * `NC_COUNTY_FIPS_ORDERED` — verified against NCSU “North Carolina County FIPS Codes”.
 */
const SHORT_NAMES_ALPHABETICAL: readonly string[] = Object.keys(raw).sort((a, b) =>
  a.localeCompare(b, 'en', { sensitivity: 'base' })
)

if (SHORT_NAMES_ALPHABETICAL.length !== NC_COUNTY_FIPS_ORDERED.length) {
  throw new Error('ncCountyZips county count must match NC_COUNTY_FIPS_ORDERED')
}

/** Census short name for this 5-digit NC county FIPS (e.g. 37183 → Wake). */
export function getNcCountyShortNameForFips(fips: string): string {
  const idx = NC_COUNTY_FIPS_ORDERED.indexOf(fips.trim())
  if (idx < 0) return ''
  return SHORT_NAMES_ALPHABETICAL[idx] ?? ''
}
