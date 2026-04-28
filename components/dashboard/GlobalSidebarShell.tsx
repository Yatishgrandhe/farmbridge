'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  Clock,
  ClipboardCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Wrench,
  BookOpen,
  HandHeart,
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import styles from './GlobalSidebarShell.module.css'

const NAV_ITEMS = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/programs', label: 'My Programs', icon: FolderKanban },
  { href: '/toolkit', label: 'Toolkit', icon: Wrench },
  { href: '/resources', label: 'Resource Center', icon: BookOpen },
  { href: '/volunteer', label: 'Volunteer', icon: HandHeart },
  { href: '/alerts', label: 'Saved Alerts', icon: Bell },
  { href: '/dashboard/hours', label: 'Volunteer Hours', icon: Clock },
  { href: '/dashboard/signups', label: 'Application Tracker', icon: ClipboardCheck },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function navLinkActive(pathname: string, href: string) {
  if (href === '/dashboard/overview') {
    return pathname === '/dashboard' || pathname === '/dashboard/overview'
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

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

  return (
    <div className={`${styles.shell} dashboard-shell`}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoDot} />
            {!collapsed && <span className={styles.logoText}>FARMBRIDGE</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseButton}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = navLinkActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${collapsed ? styles.navLinkCentered : ''}`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className={styles.footer}>
          {!collapsed && (
            <div className={styles.userSection}>
              <div className={styles.userAvatar}>
                <User size={16} />
              </div>
              <div className={styles.userDetails}>
                <p className={styles.userName}>{fullName || 'Farmer'}</p>
                <p className={styles.userCounty}>NC Agricultural Network</p>
              </div>
            </div>
          )}
          <button onClick={signOut} className={styles.logoutButton}>
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
