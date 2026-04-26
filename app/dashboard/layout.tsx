import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/dashboard/overview')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, account_type, email')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!profile) redirect('/login?redirectTo=/dashboard/overview')

  return <>{children}</>
}
