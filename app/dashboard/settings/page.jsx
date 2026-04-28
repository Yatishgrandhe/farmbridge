import { redirect } from 'next/navigation'

import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { createServerClient } from '@/lib/supabase/server'

import styles from '../dashboard.module.css'

export default async function DashboardSettingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/dashboard/settings')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, city, zip_code, account_type')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!profile) redirect('/login?redirectTo=/dashboard/settings')

  const accountLabel =
    profile.account_type === 'organization' ? 'Organization' : 'Volunteer'

  return (
    <main className={styles.dashboardPage}>
      <section className={`${styles.dashboardHero} animate-on-scroll`}>
        <div className={styles.heroContent}>
          <p className="label">ACCOUNT</p>
          <h1 className="display-lg">Settings</h1>
          <p className="body-md" style={{ maxWidth: '600px' }}>
            Update your profile details. Email is tied to your login and cannot be changed here.
          </p>
        </div>
      </section>

      <div className="animate-on-scroll">
        <SettingsForm
          defaultValues={{
            fullName: profile.full_name ?? '',
            email: user.email ?? '',
            phone: profile.phone ?? '',
            city: profile.city ?? '',
            zipCode: profile.zip_code ?? '',
            accountType: accountLabel,
          }}
        />
      </div>
    </main>
  )
}
