import raw from '@/lib/data/ncCountyZips.json'

/** County name → ZCTA zip codes from HUD crosswalk (NC only). Keys match census county labels. */
const BY_LOWER = new Map<string, string[]>()

for (const [name, zips] of Object.entries(raw)) {
  BY_LOWER.set(name.trim().toLowerCase(), zips as string[])
}

/** Match DB labels like "Wake County" or "Wake" to JSON keys like "Wake". */
export function normalizeNcCountyLabelForZipLookup(countyName: string): string {
  return countyName.replace(/\s+county\s*$/i, '').trim().toLowerCase()
}

/** All zip codes for an NC county name (case-insensitive; strips a trailing "County"). */
export function getZipsForNcCountyName(countyName: string): string[] {
  const bare = normalizeNcCountyLabelForZipLookup(countyName)
  return BY_LOWER.get(bare) ?? []
}
