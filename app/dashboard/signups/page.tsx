import { createServerClient } from '@/lib/supabase/server'
import { manageSignupAction } from '@/lib/volunteer/actions'

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
        <h1 className="font-display text-3xl text-wheat font-bold">
          {profile?.account_type === 'organization' ? 'Signup Queue (Organization)' : 'My Signups'}
        </h1>
        <p className="text-wheat/60">
          {profile?.account_type === 'organization'
            ? 'Review volunteer signups, approve quickly, or delay/delete records as needed.'
            : 'Track your signups. You can remove any signup from your history here.'}
        </p>
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
            <div className="mt-3 flex flex-wrap gap-2">
              {profile?.account_type === 'organization' ? (
                <>
                  <form action={manageSignupAction}>
                    <input type="hidden" name="signupId" value={signup.id} />
                    <button type="submit" name="action" value="approve" className="rounded-md bg-growth px-3 py-1.5 text-xs text-parchment">
                      Approve
                    </button>
                  </form>
                  <form action={manageSignupAction}>
                    <input type="hidden" name="signupId" value={signup.id} />
                    <button type="submit" name="action" value="delay" className="rounded-md border border-wheat/20 px-3 py-1.5 text-xs text-wheat/75">
                      Delay (Pending)
                    </button>
                  </form>
                  <form action={manageSignupAction}>
                    <input type="hidden" name="signupId" value={signup.id} />
                    <button type="submit" name="action" value="delete" className="rounded-md border border-crisis/40 px-3 py-1.5 text-xs text-crisis">
                      Delete
                    </button>
                  </form>
                </>
              ) : (
                <form action={manageSignupAction}>
                  <input type="hidden" name="signupId" value={signup.id} />
                  <button type="submit" name="action" value="delete" className="rounded-md border border-crisis/40 px-3 py-1.5 text-xs text-crisis">
                    Delete Signup
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
