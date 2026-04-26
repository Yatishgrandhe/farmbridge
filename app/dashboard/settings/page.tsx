import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardSettingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user?.id ?? '')
    .maybeSingle()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl text-wheat font-bold">Account Settings</h1>
        <p className="text-wheat/60">Profile and contact information used in volunteer workflows.</p>
      </div>
      <div className="rounded-xl border border-wheat/10 bg-soil/50 p-5 space-y-3 text-sm">
        <p className="text-wheat/80"><span className="text-wheat/55">Name:</span> {profile?.full_name ?? 'N/A'}</p>
        <p className="text-wheat/80"><span className="text-wheat/55">Email:</span> {profile?.email ?? user?.email ?? 'N/A'}</p>
        <p className="text-wheat/80"><span className="text-wheat/55">Phone:</span> {profile?.phone ?? 'N/A'}</p>
        <p className="text-wheat/80 capitalize"><span className="text-wheat/55">Account Type:</span> {profile?.account_type ?? 'volunteer'}</p>
        <p className="text-wheat/80"><span className="text-wheat/55">Location:</span> {profile?.city ?? 'N/A'}, {profile?.state ?? 'NC'} {profile?.zip_code ?? ''}</p>
      </div>
    </div>
  )
}
