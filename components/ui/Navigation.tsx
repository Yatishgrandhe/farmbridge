'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
      className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-300 ${
        scrolled ? 'bg-ash/80 backdrop-blur-md border-b border-wheat/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-14 w-14 rounded-xl bg-soil/80 border border-wheat/15 p-1.5 shadow-card animate-logo-breathe">
            <Image
              src="/logo-mark.png"
              alt="FarmBridge Logo"
              width={56}
              height={56}
              className="h-full w-full object-contain transform group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <span className="text-wheat font-display font-bold text-brand tracking-tight leading-none whitespace-nowrap max-[420px]:hidden">
            FarmBridge
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-nav font-body tracking-wide transition-colors ${
                pathname === link.href ? 'text-wheat font-semibold' : 'text-wheat/60 hover:text-wheat'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/eligibility"
            className="px-4 py-2.5 bg-wheat/10 text-wheat hover:bg-wheat hover:text-ash font-body text-nav font-semibold rounded-full transition-colors"
          >
            Check Eligibility
          </Link>
          <Link
            href="/resources#submit-resource"
            className="px-4 py-2.5 bg-growth text-parchment hover:bg-growth/90 font-body text-nav font-semibold rounded-full transition-colors"
          >
            Submit Resource
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 border border-wheat/20 text-wheat/80 hover:text-wheat font-body text-nav font-semibold rounded-full transition-colors"
          >
            Log In
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="lg:hidden px-3 py-2 rounded-lg border border-wheat/20 text-wheat text-xs font-mono uppercase tracking-widest"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <>
          <button
            className="lg:hidden fixed inset-0 bg-ash/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="lg:hidden fixed top-0 right-0 h-screen w-[320px] border-l border-wheat/10 bg-ash/95 backdrop-blur-md p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-wheat font-mono text-xs uppercase tracking-widest">Navigation</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="px-2 py-1 rounded-md border border-wheat/20 text-wheat/80 text-xs"
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === link.href ? 'bg-wheat/10 text-wheat font-semibold' : 'text-wheat/70 hover:text-wheat'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/eligibility"
              onClick={() => setMobileOpen(false)}
              className="mt-2 text-center px-4 py-2.5 bg-wheat text-ash font-body text-sm font-semibold rounded-lg"
            >
              Check Eligibility
            </Link>
            <Link
              href="/resources#submit-resource"
              onClick={() => setMobileOpen(false)}
              className="text-center px-4 py-2.5 bg-growth text-parchment font-body text-sm font-semibold rounded-lg"
            >
              Submit Resource
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center px-4 py-2.5 border border-wheat/20 text-wheat/80 font-body text-sm font-semibold rounded-lg"
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
