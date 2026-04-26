import { createServerClient } from '@/lib/supabase/server'
import { VolunteerHub } from '@/components/volunteer/VolunteerHub'

export default async function VolunteerPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: counties }, { data: listings }, { data: profile }] = await Promise.all([
    supabase.from('counties').select('fips_code,name').order('name'),
    supabase.from('volunteer_listings').select('*').eq('status', 'open').order('volunteer_date'),
    user
      ? supabase.from('profiles').select('account_type').eq('auth_user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  const canCreateListing = profile?.account_type === 'organization'

  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 pt-28 pb-20 space-y-8">
        <div className="max-w-3xl">
          <span className="text-growth font-mono text-xs uppercase tracking-widest">Volunteer + Manpower Hub</span>
          <h1 className="font-display text-5xl text-wheat font-bold mt-3 mb-4">
            Coordinate farm and program manpower across the United States
          </h1>
          <p className="text-wheat/70 leading-relaxed">
            Browse open opportunities and post manpower needs.
            Volunteers can sign up with exact time ranges and declared hours. Logged-in hour history
            is credited after organization approval.
          </p>
          {!user && (
            <p className="mt-3 text-sm text-ember">
              You can browse and sign up without an account, but dashboard features (hour history, deleting signups,
              approvals, and management tools) are only available after login.
            </p>
          )}
        </div>
        <VolunteerHub counties={counties ?? []} initialListings={listings ?? []} canCreateListing={canCreateListing} />
      </div>
    </main>
  )
}
