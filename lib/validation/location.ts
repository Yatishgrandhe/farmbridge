import { COUNTY_ZIP_CODES } from '@/lib/data/countyZipCodes'

const NC_STATE = 'NC'

const NC_ZIP_SET = new Set(
  Object.values(COUNTY_ZIP_CODES)
    .flat()
    .map((zip) => zip.trim())
)

export function isValidNcZip(zipCode: string) {
  const normalized = zipCode.trim()
  return /^\d{5}$/.test(normalized) && NC_ZIP_SET.has(normalized)
}

export function normalizeNcState(state: string) {
  return state.trim().toUpperCase() === NC_STATE ? NC_STATE : state.trim().toUpperCase()
}

export function assertNcState(state: string) {
  return normalizeNcState(state) === NC_STATE
}
