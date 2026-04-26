import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardListingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, account_type')
    .eq('auth_user_id', user?.id ?? '')
    .maybeSingle()

  if (!profile || profile.account_type !== 'organization') {
    redirect('/dashboard/overview')
  }

  const { data: listings } = await supabase
    .from('volunteer_listings')
    .select('*')
    .order('volunteer_date', { ascending: true })
    .limit(40)

  const canCreate = Boolean(profile.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-wheat font-bold">Volunteer Listings</h1>
          <p className="text-wheat/60">Review and manage farm/program manpower listings.</p>
        </div>
        {canCreate && (
          <Link href="/volunteer?tab=create-listing" className="rounded-lg bg-growth px-4 py-2 text-parchment text-sm font-semibold">
            Create Listing
          </Link>
        )}
      </div>
      <div className="grid gap-3">
        {(listings ?? []).map((listing) => (
          <article key={listing.id} className="rounded-xl border border-wheat/10 bg-soil/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-wheat font-semibold">{listing.title}</h2>
              <span className="text-xs font-mono text-wheat/55 uppercase">{listing.status}</span>
            </div>
            <p className="text-sm text-wheat/70 mt-1">{listing.description}</p>
            <p className="text-xs text-wheat/55 mt-2">
              {listing.city}, {listing.state} {listing.zip_code} • {listing.volunteer_date} {listing.start_time} - {listing.end_time}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
