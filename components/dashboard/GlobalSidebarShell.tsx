'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Overview', icon: '📊' },
  { href: '/dashboard/signups', label: 'Signups', icon: '🗂️' },
  { href: '/dashboard/hours', label: 'Hours', icon: '⏱️' },
  { href: '/dashboard/listings', label: 'Listings', icon: '🌾' },
  { href: '/dashboard/resources', label: 'Resources', icon: '🧰' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  { href: '/volunteer', label: 'Volunteer Hub', icon: '🤝' },
  { href: '/programs', label: 'Programs', icon: '📁' },
  { href: '/resources', label: 'Resource Page', icon: '📚' },
  { href: '/alerts', label: 'Alerts', icon: '🚨' },
  { href: '/impact', label: 'Impact', icon: '📍' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
  { href: '/support', label: 'Support', icon: '🛟' },
]

export function GlobalSidebarShell({
  children,
  fullName,
}: {
  children: React.ReactNode
  fullName: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const signOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-ash flex">
      <aside
        className={`border-r border-wheat/10 bg-soil/60 transition-all flex flex-col min-h-screen ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-4 border-b border-wheat/10 flex items-center justify-between">
          <div className={collapsed ? 'hidden' : ''}>
            <p className="text-wheat text-lg font-display font-bold">FarmBridge</p>
            <p className="text-wheat/60 text-xs">Logged-in navigation</p>
          </div>
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="px-2 py-1 border border-wheat/20 rounded text-xs text-wheat/70"
          >
            {collapsed ? '>' : '<'}
          </button>
        </div>
        <nav className="p-3 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-growth/30 text-wheat font-semibold'
                  : 'text-wheat/70 hover:text-wheat hover:bg-wheat/5'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <span aria-hidden>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
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
            {collapsed ? '🚪' : 'Log out'}
          </button>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}
