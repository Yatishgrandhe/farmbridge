'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './Navigation.module.css'

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/programs', label: 'Programs' },
    { href: '/volunteer', label: 'Volunteer' },
    { href: '/resources', label: 'Resources' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/impact', label: 'Impact Data' },
    { href: '/about', label: 'About' },
    { href: '/support', label: 'Support' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      aria-label="Primary navigation"
      className={`${styles.nav} ${scrolled ? styles.scrolled : styles.notScrolled}`}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image
              src="/logo-mark.png"
              alt="FarmBridge Logo"
              width={56}
              height={56}
              priority
            />
          </div>
          <span className={styles.logoText}>
            FarmBridge
          </span>
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
          <Link
            href="/eligibility"
            className={styles.buttonPrimary}
          >
            Check Eligibility
          </Link>
          <Link
            href="/resources#submit-resource"
            className={styles.buttonGrowth}
          >
            Submit Resource
          </Link>
          <Link
            href="/login"
            className={styles.buttonOutline}
          >
            Log In
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className={styles.mobileToggleButton}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <>
          <button
            className={styles.mobileOverlay}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className={styles.mobileSidebar}>
            <div className={styles.mobileSidebarHeader}>
              <p className={styles.mobileSidebarTitle}>Navigation</p>
              <button
                onClick={() => setMobileOpen(false)}
                className={styles.mobileCloseButton}
              >
                Close
              </button>
            </div>
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
            </div>
            <div className={styles.mobileActionList}>
              <Link
                href="/eligibility"
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileActionButton} ${styles.mobileButtonWheat}`}
              >
                Check Eligibility
              </Link>
              <Link
                href="/resources#submit-resource"
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileActionButton} ${styles.mobileButtonGrowth}`}
              >
                Submit Resource
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileActionButton} ${styles.mobileButtonOutline}`}
              >
                Log In
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
