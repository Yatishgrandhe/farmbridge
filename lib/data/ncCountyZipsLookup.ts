import raw from '@/lib/data/ncCountyZips.json'

/** County name → ZCTA zip codes from HUD crosswalk (NC only). Keys match census county labels. */
const BY_LOWER = new Map<string, string[]>()

for (const [name, zips] of Object.entries(raw)) {
  BY_LOWER.set(name.trim().toLowerCase(), zips as string[])
}

/** All zip codes for an NC county name (case-insensitive). */
export function getZipsForNcCountyName(countyName: string): string[] {
  const key = countyName.trim().toLowerCase()
  return BY_LOWER.get(key) ?? []
}
