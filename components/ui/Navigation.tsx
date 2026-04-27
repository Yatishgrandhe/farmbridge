'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Navigation.module.css'

export function Navigation() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/programs', label: 'PROGRAMS' },
    { href: '/alerts', label: 'ALERTS' },
    { href: '/impact', label: 'IMPACT' },
    { href: '/volunteer', label: 'VOLUNTEER' },
    { href: '/about', label: 'ABOUT' },
    { href: '/support', label: 'SUPPORT' },
  ]

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>FARMBRIDGE</span>
        </Link>

        <div className={styles.desktopMenu}>
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
          <Link href="/login" className={styles.loginLink}>LOGIN</Link>
          <Link href="/signup" className={styles.signupButton}>SIGNUP</Link>
          <Link href="/dashboard" className={styles.dashboardButton}>DASHBOARD</Link>
        </div>

        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className={styles.mobileToggleButton}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className={styles.mobileOverlay}
            onClick={() => setMobileOpen(false)}
          />
          <div className={styles.mobileSidebar}>
            <div className={styles.mobileMenuList}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`${styles.mobileNavLink} ${pathname === link.href ? styles.mobileNavLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-fog)', margin: 'var(--space-md) 0' }} />
              <Link href="/login" onClick={() => setMobileOpen(false)} className={styles.mobileNavLink}>LOGIN</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className={styles.mobileNavLink}>SIGNUP</Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={styles.mobileNavLink}>DASHBOARD</Link>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
