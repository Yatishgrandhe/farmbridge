const US_STATES = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
])

export function isValidUsZip(zipCode: string) {
  return /^\d{5}$/.test(zipCode.trim())
}

export function normalizeUsState(state: string) {
  return state.trim().toUpperCase()
}

export function assertUsState(state: string) {
  return US_STATES.has(normalizeUsState(state))
}
