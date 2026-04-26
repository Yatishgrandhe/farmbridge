import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { resourceSubmissionSchema } from '@/lib/validation/volunteer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') ?? 'approved'

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('resource_submissions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ submissions: data ?? [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = resourceSubmissionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let submitterProfileId: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()
    submitterProfileId = profile?.id ?? null
  }

  const { data, error } = await supabase
    .from('resource_submissions')
    .insert({
      submitter_profile_id: submitterProfileId,
      program_name: parsed.data.programName,
      provider_name: parsed.data.providerName ?? null,
      category: parsed.data.category ?? null,
      description: parsed.data.description,
      county_fips: parsed.data.countyFips || null,
      address: parsed.data.address,
      city: parsed.data.city,
      state: parsed.data.state,
      zip_code: parsed.data.zipCode,
      contact_name: parsed.data.contactName,
      contact_email: parsed.data.contactEmail,
      contact_phone: parsed.data.contactPhone ?? null,
      website_url: parsed.data.websiteUrl ?? null,
      status: 'pending',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ submission: data }, { status: 201 })
}
