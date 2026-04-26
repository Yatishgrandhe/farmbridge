export type ProgramCategory = {
  value: string
  label: string
  emoji?: string
}

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  { value: 'all', label: 'All Programs' },
  { value: 'disaster_relief', label: 'Disaster Relief', emoji: '🚨' },
  { value: 'conservation', label: 'Conservation', emoji: '🌱' },
  { value: 'loan', label: 'Loans', emoji: '💰' },
  { value: 'commodity_support', label: 'Commodity Support', emoji: '🌽' },
  { value: 'mental_health', label: 'Mental Health', emoji: '💙' },
  { value: 'young_farmer', label: 'Young Farmers', emoji: '🌾' },
]
