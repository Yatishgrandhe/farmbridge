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
import styles from './GlobalSidebarShell.module.css'

const NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/signups', label: 'Signups', icon: ClipboardList },
  { href: '/dashboard/hours', label: 'Hours', icon: Timer },
  { href: '/dashboard/listings', label: 'Listings', icon: Sprout, requireOrg: true },
  { href: '/dashboard/resources', label: 'Resources', icon: Wrench, requireOrg: true },
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
  accountType,
}: {
  children: React.ReactNode
  fullName: string
  accountType: 'volunteer' | 'organization'
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

  const visibleNavItems = NAV_ITEMS.filter((item) => !(item.requireOrg && accountType !== 'organization'))

  return (
    <div className={styles.shell}>
      <aside
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}
      >
        <div className={styles.header}>
          {!collapsed && (
            <div>
              <p className={styles.headerTitle}>FarmBridge</p>
              <p className={styles.headerSubtitle}>Logged-in navigation</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((value) => !value)}
            className={styles.collapseButton}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
        <nav aria-label="Dashboard navigation" className={styles.nav}>
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''} ${collapsed ? styles.navLinkCentered : ''}`}
            >
              <item.icon size={16} aria-hidden />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className={styles.footer}>
          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.userNameRow}>
                <UserCircle2 size={16} />
                <p className={styles.userName}>{fullName}</p>
              </div>
              <p className={styles.userStatus}>Signed in</p>
            </div>
          )}
          <button
            onClick={signOut}
            className={styles.logoutButton}
          >
            <LogOut size={15} />
            {!collapsed && 'Log out'}
          </button>
        </div>
      </aside>
      <main
        id="main-content"
        className={`${styles.main} ${collapsed ? styles.mainCollapsed : styles.mainExpanded}`}
      >
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>
  )
}
