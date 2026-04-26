import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardSignupsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user?.id ?? '')
    .maybeSingle()

  const query = supabase.from('volunteer_signups').select('*, volunteer_listings(title,city,state,zip_code)')
  const { data: signups } =
    profile?.account_type === 'organization'
      ? await query.order('created_at', { ascending: false }).limit(80)
      : await query.eq('profile_id', profile?.id ?? '').order('created_at', { ascending: false }).limit(80)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-wheat font-bold">Volunteer Signups</h1>
        <p className="text-wheat/60">Track who signed up, when, and for how long.</p>
      </div>
      <div className="grid gap-3">
        {(signups ?? []).map((signup) => (
          <article key={signup.id} className="rounded-xl border border-wheat/10 bg-soil/50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-wheat font-semibold">{signup.volunteer_name}</h2>
              <span className="text-xs font-mono uppercase text-wheat/55">{signup.status}</span>
            </div>
            <p className="text-sm text-wheat/70">
              {signup.volunteer_listings?.title ?? 'Listing'} • {signup.volunteer_date}
            </p>
            <p className="text-xs text-wheat/55 mt-1">
              {signup.start_time} - {signup.end_time} • {signup.declared_hours} hrs • {signup.volunteer_email}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
