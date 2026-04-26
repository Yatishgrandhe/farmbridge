'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface DashboardShellProps {
  accountType: 'volunteer' | 'organization'
  fullName: string
  children: React.ReactNode
}

const volunteerNav = [
  { href: '/dashboard/overview', label: 'Overview' },
  { href: '/dashboard/signups', label: 'My Signups' },
  { href: '/dashboard/hours', label: 'Hour History' },
  { href: '/dashboard/settings', label: 'Settings' },
]

const orgNav = [
  { href: '/dashboard/overview', label: 'Overview' },
  { href: '/dashboard/listings', label: 'Listings' },
  { href: '/dashboard/signups', label: 'Signups' },
  { href: '/dashboard/hours', label: 'Approvals' },
  { href: '/dashboard/resources', label: 'Resources' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export function DashboardShell({ accountType, fullName, children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const nav = accountType === 'organization' ? orgNav : volunteerNav

  const signOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-ash flex">
      <aside
        className={`border-r border-wheat/10 bg-soil/60 transition-all ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-4 border-b border-wheat/10 flex items-center justify-between">
          <div className={collapsed ? 'hidden' : ''}>
            <p className="text-wheat text-lg font-display font-bold">Dashboard</p>
            <p className="text-wheat/60 text-xs capitalize">{accountType} account</p>
          </div>
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="px-2 py-1 border border-wheat/20 rounded text-xs text-wheat/70"
          >
            {collapsed ? '>' : '<'}
          </button>
        </div>

        <nav className="p-3 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-growth/30 text-wheat font-semibold'
                  : 'text-wheat/70 hover:text-wheat hover:bg-wheat/5'
              } ${collapsed ? 'text-center' : ''}`}
            >
              {collapsed ? item.label.slice(0, 1) : item.label}
            </Link>
          ))}
          <Link
            href="/volunteer"
            className={`block rounded-lg px-3 py-2 text-sm text-wheat/70 hover:text-wheat hover:bg-wheat/5 ${collapsed ? 'text-center' : ''}`}
          >
            {collapsed ? 'V' : 'Volunteer Hub'}
          </Link>
        </nav>

        <div className="mt-auto p-4 border-t border-wheat/10">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-wheat text-sm font-semibold">{fullName}</p>
              <p className="text-wheat/55 text-xs">Signed in</p>
            </div>
          )}
          <button
            onClick={signOut}
            className="w-full rounded-lg border border-wheat/20 px-3 py-2 text-sm text-wheat/70 hover:text-wheat"
          >
            {collapsed ? 'Out' : 'Log out'}
          </button>
        </div>
      </aside>
      <section className="flex-1 p-6 md:p-8">{children}</section>
    </div>
  )
}
