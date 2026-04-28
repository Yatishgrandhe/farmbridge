import Link from 'next/link'
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
      <section className={`${styles.topBanner} animate-on-scroll`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerText}>
            <p className={styles.bannerEyebrow}>ACCOUNT</p>
            <h1 className={styles.bannerHeading}>Settings</h1>
            <p className={styles.bannerSubtext}>
            Update your profile details. Email is tied to your login and cannot be changed here.
            </p>
          </div>
        </div>
      </section>

      <nav className="animate-on-scroll" aria-label="Dashboard shortcuts" style={{ margin: '24px 40px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/alerts" className={styles.secondaryButton}>Saved alerts</Link>
          <Link href="/resources" className={styles.secondaryButton}>Resource center</Link>
          <Link href="/volunteer" className={styles.secondaryButton}>Volunteer hub</Link>
          <Link href="/toolkit" className={styles.secondaryButton}>Toolkit</Link>
        </div>
      </nav>

      <div className="animate-on-scroll" style={{ padding: '0 40px 32px' }}>
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
