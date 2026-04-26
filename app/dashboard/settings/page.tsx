import { createServerClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/dashboard/SettingsForm'

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
        <p className="text-wheat/60">Update your profile and contact information used in volunteer workflows.</p>
      </div>
      <SettingsForm
        defaultValues={{
          fullName: profile?.full_name ?? '',
          email: profile?.email ?? user?.email ?? '',
          phone: profile?.phone ?? '',
          city: profile?.city ?? '',
          zipCode: profile?.zip_code ?? '',
          accountType: profile?.account_type ?? 'volunteer',
        }}
      />
    </div>
  )
}
