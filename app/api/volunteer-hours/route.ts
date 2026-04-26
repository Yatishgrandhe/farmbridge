import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { approvalSchema } from '@/lib/validation/volunteer'

export async function GET() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ hours: [] })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  const query = supabase
    .from('volunteer_hours')
    .select('*, volunteer_signups(volunteer_name, volunteer_email), volunteer_listings(title)')
    .order('created_at', { ascending: false })

  const { data, error } =
    profile?.account_type === 'organization'
      ? await query.limit(100)
      : await query.eq('profile_id', profile?.id ?? '').limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ hours: data ?? [] })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const parsed = approvalSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: approverProfile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()
  if (!approverProfile || approverProfile.account_type !== 'organization') {
    return NextResponse.json({ error: 'Organization account required' }, { status: 403 })
  }

  const isApproved = parsed.data.decision === 'approved'
  const now = new Date().toISOString()

  const { error: signupError } = await supabase
    .from('volunteer_signups')
    .update({ status: isApproved ? 'approved' : 'rejected', updated_at: now })
    .eq('id', parsed.data.signupId)
  if (signupError) return NextResponse.json({ error: signupError.message }, { status: 500 })

  const { data, error } = await supabase
    .from('volunteer_hours')
    .update({
      status: isApproved ? 'approved' : 'rejected',
      hours_approved: isApproved ? parsed.data.approvedHours ?? null : null,
      approved_by_profile_id: approverProfile.id,
      approved_at: now,
      updated_at: now,
    })
    .eq('signup_id', parsed.data.signupId)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ hour: data })
}
