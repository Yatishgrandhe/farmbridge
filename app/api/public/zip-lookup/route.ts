import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Public lookup: 5-digit NC ZIP → county FIPS (and display name) for resource filters.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('zip')?.replace(/\D/g, '') ?? ''
  const zip = raw.length > 5 ? raw.slice(0, 5) : raw
  if (zip.length !== 5) {
    return NextResponse.json({ error: 'Invalid ZIP' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('nc_zip_codes')
    .select('zip_code, county_fips, county_name, city, state_abbr')
    .eq('zip_code', zip)
    .eq('state_abbr', 'NC')
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ match: null })
  }

  return NextResponse.json({
    match: {
      zip: data.zip_code,
      countyFips: data.county_fips,
      countyName: data.county_name,
      city: data.city,
    },
  })
}
