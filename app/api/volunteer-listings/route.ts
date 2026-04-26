import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { listingSchema } from '@/lib/validation/volunteer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const countyFips = searchParams.get('countyFips')
  const zipCode = searchParams.get('zipCode')
  const date = searchParams.get('date')

  const supabase = await createServerClient()
  let query = supabase.from('volunteer_listings').select('*').eq('status', 'open').order('volunteer_date')
  if (countyFips) query = query.eq('county_fips', countyFips)
  if (zipCode) query = query.eq('zip_code', zipCode)
  if (date) query = query.eq('volunteer_date', date)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listings: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = listingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Login required to create listing' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!profile || profile.account_type !== 'organization') {
    return NextResponse.json({ error: 'Organization account required to create listings' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('volunteer_listings')
    .insert({
      listing_type: parsed.data.listingType,
      title: parsed.data.title,
      description: parsed.data.description,
      program_id: parsed.data.programId ?? null,
      county_fips: parsed.data.countyFips || null,
      address: parsed.data.address,
      city: parsed.data.city,
      state: parsed.data.state,
      zip_code: parsed.data.zipCode,
      contact_name: parsed.data.contactName,
      contact_email: parsed.data.contactEmail,
      contact_phone: parsed.data.contactPhone ?? null,
      volunteer_date: parsed.data.volunteerDate,
      start_time: parsed.data.startTime,
      end_time: parsed.data.endTime,
      required_volunteers: parsed.data.requiredVolunteers,
      created_by_profile_id: profile?.id ?? null,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listing: data }, { status: 201 })
}
