import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { signupSchema } from '@/lib/validation/volunteer'

export async function GET() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ signups: [] })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  const query = supabase
    .from('volunteer_signups')
    .select('*, volunteer_listings(title,city,state,zip_code)')
    .order('created_at', { ascending: false })

  const { data, error } =
    profile?.account_type === 'organization'
      ? await query.limit(80)
      : await query.eq('profile_id', profile?.id ?? '').limit(80)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ signups: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileId: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()
    profileId = profile?.id ?? null
  }

  const { data: listing } = await supabase
    .from('volunteer_listings')
    .select('id,status')
    .eq('id', parsed.data.listingId)
    .maybeSingle()
  if (!listing || listing.status !== 'open') {
    return NextResponse.json({ error: 'Listing is not available for signup.' }, { status: 400 })
  }

  const { data: signup, error: signupError } = await supabase
    .from('volunteer_signups')
    .insert({
      listing_id: parsed.data.listingId,
      profile_id: profileId,
      volunteer_name: parsed.data.volunteerName,
      volunteer_email: parsed.data.volunteerEmail,
      volunteer_phone: parsed.data.volunteerPhone ?? null,
      volunteer_date: parsed.data.volunteerDate,
      start_time: parsed.data.startTime,
      end_time: parsed.data.endTime,
      declared_hours: parsed.data.declaredHours,
      status: 'pending',
    })
    .select('*')
    .single()

  if (signupError) return NextResponse.json({ error: signupError.message }, { status: 500 })

  const { error: hoursError } = await supabase.from('volunteer_hours').insert({
    signup_id: signup.id,
    listing_id: parsed.data.listingId,
    profile_id: profileId,
    hours_submitted: parsed.data.declaredHours,
    status: 'pending',
  })

  if (hoursError) return NextResponse.json({ error: hoursError.message }, { status: 500 })
  return NextResponse.json({ signup }, { status: 201 })
}
