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
    { href: '/eligibility', label: 'ELIGIBILITY' },
    { href: '/toolkit', label: 'TOOLKIT' },
    { href: '/resources', label: 'RESOURCES' },
    { href: '/alerts', label: 'ALERTS' },
    { href: '/impact', label: 'IMPACT' },
    { href: '/volunteer', label: 'VOLUNTEER' },
    { href: '/about', label: 'ABOUT' },
    { href: '/support', label: 'SUPPORT' },
  ]

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      <div className={styles.bar}>
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
            <Link href="/login" className={styles.loginLink}>
              LOGIN
            </Link>
            <Link href="/signup" className={styles.signupButton}>
              SIGNUP
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`${styles.mobileToggleButton} ${mobileOpen ? styles.mobileToggleOpen : ''}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-dropdown"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-dropdown"
        className={`${styles.mobileDropdown} ${mobileOpen ? styles.mobileDropdownOpen : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.mobileDropdownInner}>
          <div className={styles.mobileLinkList}>
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
          </div>
          <div className={styles.mobileActions}>
            <Link href="/login" onClick={() => setMobileOpen(false)} className={styles.mobileSecondary}>
              LOGIN
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className={styles.mobilePrimary}>
              SIGNUP
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
