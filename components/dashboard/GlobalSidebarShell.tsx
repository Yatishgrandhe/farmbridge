'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  HandHelping,
  Info,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Sprout,
  Timer,
  UserCircle2,
  Wrench,
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/signups', label: 'Signups', icon: ClipboardList },
  { href: '/dashboard/hours', label: 'Hours', icon: Timer },
  { href: '/dashboard/listings', label: 'Listings', icon: Sprout },
  { href: '/dashboard/resources', label: 'Resources', icon: Wrench },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/volunteer', label: 'Volunteer Hub', icon: HandHelping },
  { href: '/programs', label: 'Programs', icon: FolderKanban },
  { href: '/resources', label: 'Resource Page', icon: BookOpen },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/impact', label: 'Impact', icon: BarChart3 },
  { href: '/about', label: 'About', icon: Info },
  { href: '/support', label: 'Support', icon: LifeBuoy },
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
    <div className="min-h-screen bg-ash">
      <aside
        className={`fixed top-0 left-0 z-50 h-screen border-r border-wheat/10 bg-soil/90 backdrop-blur-md transition-all flex flex-col ${
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
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
              <item.icon size={16} aria-hidden />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-wheat/10 bg-soil/95">
          {!collapsed && (
            <div className="mb-3 flex items-center gap-2">
              <UserCircle2 size={16} className="text-wheat/75" />
              <p className="text-wheat text-sm font-semibold truncate">{fullName}</p>
              <p className="text-wheat/55 text-xs">Signed in</p>
            </div>
          )}
          <button
            onClick={signOut}
            className="w-full rounded-lg border border-wheat/20 px-3 py-2 text-sm text-wheat/70 hover:text-wheat flex items-center justify-center gap-2"
          >
            <LogOut size={15} />
            {!collapsed && 'Log out'}
          </button>
        </div>
      </aside>
      <main
        className={`min-h-screen transition-all ${collapsed ? 'ml-20' : 'ml-72'} p-6 md:p-8 lg:p-10`}
      >
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  )
}
