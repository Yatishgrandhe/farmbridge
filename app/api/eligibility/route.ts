import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const inputSchema = z.object({
  county: z.string(),
  crops: z.array(z.string()),
  farmSizeAcres: z.number(),
  annualSalesBracket: z.string(),
  hasExperiencedLoss: z.boolean(),
  isBeginningFarmer: z.boolean(),
  email: z.string().optional(),
})

type EligibilityRules = {
  requires_loss?: boolean
  counties?: 'all' | 'disaster_designated'
  beginning_farmer_priority?: boolean
  priority_young_beginning?: boolean
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = inputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const supabase = await createServerClient()

  // Get county FIPS
  const { data: county } = await supabase
    .from('counties')
    .select('fips_code, is_primary_disaster_area, is_contiguous_disaster_area')
    .ilike('name', data.county)
    .single()

  // Fetch all active programs
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('active', true)

  if (!programs) return NextResponse.json({ programs: [] })

  // Score and filter
  const scored = programs
    .map(p => {
      const rules = (p.eligibility_rules ?? {}) as EligibilityRules
      let score = 10 // base

      if (rules.requires_loss && !data.hasExperiencedLoss) return null
      if (rules.counties === 'disaster_designated') {
        if (!county?.is_primary_disaster_area && !county?.is_contiguous_disaster_area) {
          return null
        }
      }

      if (data.hasExperiencedLoss && rules.requires_loss) score += 20
      if (data.isBeginningFarmer && (rules.beginning_farmer_priority || rules.priority_young_beginning)) score += 15
      if (p.is_urgent) score += 10

      return { ...p, score }
    })
    .filter(Boolean)
    .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))

  // Optionally save to deadline_alerts
  if (data.email) {
    await supabase.from('deadline_alerts').upsert({
      email: data.email,
      county_fips: county?.fips_code,
      crop_types: data.crops,
    }, { onConflict: 'email' })
  }

  return NextResponse.json({ programs: scored.slice(0, 8) })
}
