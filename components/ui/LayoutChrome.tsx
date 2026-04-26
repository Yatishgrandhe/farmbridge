'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/ui/Navigation'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { createBrowserClient } from '@/lib/supabase/client'
import { GlobalSidebarShell } from '@/components/dashboard/GlobalSidebarShell'

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)
  const [fullName, setFullName] = useState('User')

  useEffect(() => {
    const run = async () => {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setIsAuthed(false)
        return
      }
      setIsAuthed(true)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('auth_user_id', user.id)
        .maybeSingle()
      setFullName(profile?.full_name ?? user.email ?? 'User')
    }
    run()
  }, [pathname])

  const hideAuthenticatedChrome = pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (isAuthed && !hideAuthenticatedChrome) {
    return <GlobalSidebarShell fullName={fullName}>{children}</GlobalSidebarShell>
  }

  return (
    <>
      <Navigation />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  )
}
