'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/ui/Navigation'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { createBrowserClient } from '@/lib/supabase/client'
import { GlobalSidebarShell } from '@/components/dashboard/GlobalSidebarShell'
import { FarmBridgeChatWidget } from '@/components/chat/FarmBridgeChatWidget'

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)
  const [fullName, setFullName] = useState('User')
  const [accountType, setAccountType] = useState<'volunteer' | 'organization'>('volunteer')

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
        .select('full_name, account_type')
        .eq('auth_user_id', user.id)
        .maybeSingle()
      setFullName(profile?.full_name ?? user.email ?? 'User')
      setAccountType((profile?.account_type as 'volunteer' | 'organization') ?? 'volunteer')
    }
    run()
  }, [pathname])

  const hideAuthenticatedChrome = pathname.startsWith('/login') || pathname.startsWith('/signup')

  if (isAuthed && !hideAuthenticatedChrome) {
    return (
      <GlobalSidebarShell fullName={fullName} accountType={accountType}>
        {children}
        <FarmBridgeChatWidget />
      </GlobalSidebarShell>
    )
  }

  return (
    <>
      <Navigation />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
      {!hideAuthenticatedChrome && <FarmBridgeChatWidget />}
    </>
  )
}
