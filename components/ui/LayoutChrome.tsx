'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/ui/Navigation'
import { SiteFooter } from '@/components/ui/SiteFooter'

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboardRoute = pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboardRoute && <Navigation />}
      <div className="flex-1">{children}</div>
      {!isDashboardRoute && <SiteFooter />}
    </>
  )
}
