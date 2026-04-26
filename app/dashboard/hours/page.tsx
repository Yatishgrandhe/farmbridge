import { createServerClient } from '@/lib/supabase/server'
import { approveVolunteerHours } from '@/lib/volunteer/actions'

export default async function DashboardHoursPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user?.id ?? '')
    .maybeSingle()

  const { data: hourRows } = await supabase
    .from('volunteer_hours')
    .select('*, volunteer_signups(volunteer_name, volunteer_email, volunteer_date, start_time, end_time), volunteer_listings(title)')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows =
    profile?.account_type === 'organization'
      ? hourRows ?? []
      : (hourRows ?? []).filter((row) => row.profile_id === profile?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-wheat font-bold">Volunteer Hours</h1>
        <p className="text-wheat/60">
          {profile?.account_type === 'organization'
            ? 'Approve volunteer hours to credit history records.'
            : 'View your pending and approved hour history.'}
        </p>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-wheat/10 bg-soil/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-wheat font-semibold">
                {row.volunteer_listings?.title ?? 'Listing'} • {row.volunteer_signups?.volunteer_name ?? 'Volunteer'}
              </h2>
              <span className="text-xs font-mono uppercase text-wheat/55">{row.status}</span>
            </div>
            <p className="text-xs text-wheat/55 mt-1">
              Submitted: {row.hours_submitted}h • Approved: {row.hours_approved ?? '—'}h
            </p>
            {profile?.account_type === 'organization' && row.status === 'pending' && (
              <form action={approveVolunteerHours} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="signupId" value={row.signup_id} />
                <input type="hidden" name="approvedHours" value={row.hours_submitted} />
                <button
                  type="submit"
                  name="decision"
                  value="approved"
                  className="rounded-md bg-growth px-3 py-1.5 text-xs text-parchment"
                >
                  Approve
                </button>
                <button
                  type="submit"
                  name="decision"
                  value="rejected"
                  className="rounded-md border border-crisis/50 px-3 py-1.5 text-xs text-crisis"
                >
                  Reject
                </button>
              </form>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
