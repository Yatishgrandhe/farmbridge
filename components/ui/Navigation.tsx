'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Navigation.module.css'

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/programs', label: 'Programs' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/eligibility', label: 'Eligibility' },
    { href: '/impact', label: 'Impact Data' },
    { href: '/volunteer', label: 'Volunteer' },
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About' },
    { href: '/support', label: 'Support' },
  ]

  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>FARMBRIDGE</span>
        </Link>

        <div className={styles.centerLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.activeLink : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className={styles.actions}>
          <Link href="/login" className={styles.loginLink}>Login</Link>
          <Link href="/signup" className={styles.signupButton}>Signup</Link>
          <Link href="/dashboard" className={styles.dashboardButton}>Dashboard</Link>
        </div>

        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className={styles.mobileToggleButton}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      <button className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />
      <div className={`${styles.mobileSidebar} ${mobileOpen ? styles.mobileSidebarOpen : ''}`}>
        <div className={styles.mobileMenuList}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className={styles.mobileActionList}>
          <Link href="/login" onClick={() => setMobileOpen(false)} className={styles.mobileActionButton}>Login</Link>
          <Link href="/signup" onClick={() => setMobileOpen(false)} className={`${styles.mobileActionButton} ${styles.mobilePrimaryAction}`}>Signup</Link>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={styles.mobileActionButton}>Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
