'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const IMAGE_SET = {
  hero:
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&auto=format&fit=crop&q=80',
  soil:
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&auto=format&fit=crop&q=80',
  wheat:
    'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=1200&auto=format&fit=crop&q=80',
  market:
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&auto=format&fit=crop&q=80',
  greenhouse:
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&auto=format&fit=crop&q=80',
  hands:
    'https://images.unsplash.com/photo-1457530378978-8bac673b8062?w=1200&auto=format&fit=crop&q=80',
  barn:
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
}

const PROGRAMS = [
  {
    title: 'Emergency Relief Pathways',
    copy: 'Fast guidance for declarations, grants, and county-specific application windows.',
    image: IMAGE_SET.wheat,
  },
  {
    title: 'County Risk Intelligence',
    copy: 'Localized drought, flood, and wildfire pressure signals with practical context.',
    image: IMAGE_SET.market,
  },
  {
    title: 'Community Action Network',
    copy: 'Volunteer mobilization, equipment sharing, and trusted field resource access.',
    image: IMAGE_SET.greenhouse,
  },
]

const STORIES = [
  {
    kicker: 'Nebraska',
    title: 'Rebuilding after two dry seasons',
    copy: 'A cooperative of family farms restored operations by pairing grant support with regional volunteer labor.',
  },
  {
    kicker: 'New Mexico',
    title: 'Water planning, refined',
    copy: 'Producers used county-level risk timing to stage irrigation upgrades before peak stress.',
  },
  {
    kicker: 'North Carolina',
    title: 'From storm loss to recovery',
    copy: 'A targeted sequence of relief programs accelerated replacement, payroll continuity, and replanting.',
  },
]

const PRIMARY_NAV_LINKS = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/alerts', label: 'Alerts', key: 'alerts' },
  { href: '/eligibility', label: 'Eligibility', key: 'eligibility' },
  { href: '/impact', label: 'Impact', key: 'impact' },
  { href: '/programs', label: 'Programs', key: 'programs' },
  { href: '/support', label: 'Support', key: 'support' },
  { href: '/volunteer', label: 'Volunteer', key: 'volunteer' },
  { href: '/resources', label: 'Resources', key: 'resources' },
]

const ACCOUNT_NAV_LINKS = [
  { href: '/login', label: 'Login', key: 'login' },
  { href: '/signup', label: 'Signup', key: 'signup' },
  { href: '/dashboard', label: 'Dashboard', key: 'dashboard' },
]

const PAGE_LINKS = [...PRIMARY_NAV_LINKS, ...ACCOUNT_NAV_LINKS]

function useGlobalDesignSystem() {
  useEffect(() => {
    const fontOne = document.createElement('link')
    fontOne.rel = 'preconnect'
    fontOne.href = 'https://fonts.googleapis.com'
    const fontTwo = document.createElement('link')
    fontTwo.rel = 'preconnect'
    fontTwo.href = 'https://fonts.gstatic.com'
    fontTwo.crossOrigin = ''
    const fontThree = document.createElement('link')
    fontThree.rel = 'stylesheet'
    fontThree.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap'

    document.head.appendChild(fontOne)
    document.head.appendChild(fontTwo)
    document.head.appendChild(fontThree)

    const styleTag = document.createElement('style')
    styleTag.id = 'farmbridge-redesign'
    styleTag.textContent = `
      :root {
        --bg: #11120f;
        --bg-soft: #191b17;
        --surface: #21241d;
        --surface-alt: #272b23;
        --text: #f4f1ea;
        --muted: #cbc3b3;
        --accent: #ef6f3e;
        --accent-soft: rgba(239, 111, 62, 0.16);
        --line: rgba(255, 255, 255, 0.16);
        --nav-bg: rgba(26, 26, 24, 0.73);
        --nav-text: #f5f0e8;
        --nav-accent: #c4622d;
        --space-1: 0.35rem;
        --space-2: 0.65rem;
        --space-3: 1rem;
        --space-4: 1.4rem;
        --space-5: 2rem;
        --space-6: 2.8rem;
        --space-7: 4rem;
        --space-8: 6rem;
        --radius-sm: 10px;
        --radius-lg: 24px;
        --radius-xl: 36px;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family: 'Manrope', sans-serif;
      }

      .site-shell {
        opacity: 0;
        transform: translateY(14px);
        animation: page-enter 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
      }

      @keyframes page-enter {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .section-wrap {
        width: min(1200px, 92vw);
        margin: 0 auto;
      }

      .top-nav {
        position: fixed;
        top: 0.9rem;
        left: 50%;
        transform: translateX(-50%);
        width: min(1260px, 94vw);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.72rem 1.2rem;
        border: 1px solid color-mix(in srgb, var(--nav-text) 18%, transparent);
        border-radius: 16px;
        background: linear-gradient(120deg, rgba(34, 34, 31, 0.68), var(--nav-bg));
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 36px rgba(0, 0, 0, 0.3);
        z-index: 300;
        isolation: isolate;
      }

      .top-nav::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(100deg, rgba(20, 20, 17, 0.55), rgba(20, 20, 17, 0.25)),
          url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1400&auto=format&fit=crop&q=80&sat=-30');
        background-size: cover;
        background-position: center;
        opacity: 0.22;
        border-radius: inherit;
        pointer-events: none;
        z-index: -1;
      }

      .nav-main {
        display: flex;
        align-items: center;
        gap: clamp(0.7rem, 1.1vw, 1.4rem);
      }

      .nav-account {
        display: flex;
        align-items: center;
        gap: 0.95rem;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        text-decoration: none;
        color: var(--nav-text);
        margin-right: 0.5rem;
      }

      .brand-mark {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: var(--nav-accent);
        box-shadow: 0 0 0 8px rgba(196, 98, 45, 0.14);
      }

      .brand-label {
        font-family: 'Cormorant Garamond', serif;
        letter-spacing: 0.13em;
        font-size: clamp(1.1rem, 1.45vw, 1.45rem);
        font-weight: 700;
        text-transform: uppercase;
      }

      .nav-links {
        display: flex;
        gap: clamp(0.55rem, 0.9vw, 1rem);
        align-items: center;
      }

      .nav-link {
        color: color-mix(in srgb, var(--nav-text) 88%, transparent);
        text-decoration: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.73rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        line-height: 1;
        position: relative;
        padding: 0.35rem 0;
        transition: color 240ms ease;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -0.2rem;
        width: 100%;
        height: 1px;
        background: var(--nav-accent);
        transform: scaleX(0);
        transform-origin: left center;
        transition: transform 260ms ease;
      }

      .nav-link:hover {
        color: var(--nav-text);
      }

      .nav-link:hover::after {
        transform: scaleX(1);
      }

      .nav-link.active {
        color: var(--nav-text);
      }

      .nav-link.active::after {
        transform: scaleX(1);
      }

      .nav-account-link {
        font-family: 'DM Sans', sans-serif;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.73rem;
        color: color-mix(in srgb, var(--nav-text) 90%, transparent);
        transition: color 220ms ease, transform 220ms ease;
      }

      .nav-account-link:hover {
        color: var(--nav-text);
      }

      .nav-login {
        background: transparent;
        border: none;
      }

      .nav-signup {
        background: var(--nav-accent);
        color: #1f1510;
        padding: 0.58rem 0.95rem;
        border-radius: 999px;
        box-shadow: 0 6px 16px rgba(196, 98, 45, 0.32);
        transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
      }

      .nav-signup:hover {
        color: #1f1510;
        transform: translateY(-1px) scale(1.03);
        box-shadow: 0 10px 20px rgba(196, 98, 45, 0.42);
        filter: saturate(108%);
      }

      .nav-dashboard {
        opacity: 0.92;
      }

      .nav-toggle {
        display: none;
        width: 38px;
        height: 34px;
        border: 1px solid color-mix(in srgb, var(--nav-text) 25%, transparent);
        border-radius: 10px;
        background: rgba(22, 22, 20, 0.55);
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .nav-toggle span,
      .nav-toggle::before,
      .nav-toggle::after {
        content: '';
        display: block;
        width: 17px;
        height: 1.5px;
        background: var(--nav-text);
        border-radius: 999px;
        transition: transform 220ms ease, opacity 220ms ease;
      }

      .nav-toggle::before {
        transform: translateY(-5px);
      }

      .nav-toggle::after {
        transform: translateY(5px);
      }

      .top-nav.menu-open .nav-toggle span {
        opacity: 0;
      }

      .top-nav.menu-open .nav-toggle::before {
        transform: translateY(1.5px) rotate(45deg);
      }

      .top-nav.menu-open .nav-toggle::after {
        transform: translateY(-1.5px) rotate(-45deg);
      }

      .mobile-drawer {
        display: none;
      }

      .hero {
        min-height: 100vh;
        position: relative;
        display: grid;
        align-items: end;
        background-image:
          linear-gradient(180deg, rgba(8, 8, 7, 0.25) 0%, rgba(10, 11, 10, 0.9) 68%, var(--bg) 100%),
          url('${IMAGE_SET.hero}');
        background-size: cover;
        background-position: center;
      }

      .hero-content {
        width: min(1200px, 92vw);
        margin: 0 auto;
        padding: 22vh 0 var(--space-8);
      }

      .eyebrow {
        font-size: 0.74rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: var(--space-4);
      }

      .hero h1 {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(2.8rem, 8vw, 6.6rem);
        line-height: 0.96;
        max-width: 16ch;
        margin: 0 0 var(--space-4);
      }

      .hero p {
        margin: 0;
        color: var(--muted);
        max-width: 52ch;
        font-size: clamp(1rem, 1.4vw, 1.2rem);
        line-height: 1.7;
      }

      .hero-actions {
        margin-top: var(--space-5);
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
      }

      .btn {
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0.85rem 1.25rem;
        font-family: inherit;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        text-decoration: none;
        transition: transform 220ms ease, border-color 220ms ease, background 220ms ease, color 220ms ease;
      }

      .btn-primary {
        background: var(--accent);
        color: #140d0b;
      }

      .btn-secondary {
        border-color: var(--line);
        background: rgba(12, 13, 11, 0.4);
        color: var(--text);
      }

      .btn:hover {
        transform: translateY(-3px);
      }

      .btn-secondary:hover {
        border-color: var(--accent);
        color: var(--accent);
      }

      .content-grid {
        padding: var(--space-8) 0 var(--space-6);
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: var(--space-6);
        align-items: center;
      }

      .section-kicker {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--accent);
      }

      .section-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(2rem, 4vw, 3.4rem);
        line-height: 1.05;
        margin: var(--space-3) 0 var(--space-4);
      }

      .section-copy {
        font-size: 1.04rem;
        color: var(--muted);
        line-height: 1.75;
        max-width: 52ch;
      }

      .image-stack {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-3);
      }

      .image-stack img,
      .program-image,
      .impact-image {
        width: 100%;
        display: block;
        object-fit: cover;
      }

      .image-stack img {
        height: 280px;
        border-radius: var(--radius-lg);
      }

      .image-stack img:last-child {
        grid-column: span 2;
        height: 330px;
      }

      .program-section {
        padding: var(--space-6) 0;
      }

      .program-grid {
        margin-top: var(--space-5);
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
      }

      .program-card {
        background: linear-gradient(175deg, var(--surface-alt), var(--surface));
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        overflow: hidden;
        transition: transform 250ms ease, border-color 250ms ease, box-shadow 250ms ease;
      }

      .program-card:hover {
        transform: translateY(-8px);
        border-color: rgba(239, 111, 62, 0.48);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
      }

      .program-image {
        height: 220px;
      }

      .program-content {
        padding: var(--space-4);
      }

      .program-content h3 {
        margin: 0 0 var(--space-2);
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.7rem;
      }

      .program-content p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .impact-strip {
        margin: var(--space-7) auto;
        width: min(1200px, 92vw);
        border: 1px solid var(--line);
        border-radius: var(--radius-xl);
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        background: var(--surface);
      }

      .impact-image {
        height: 100%;
        min-height: 360px;
      }

      .impact-content {
        padding: var(--space-6);
        display: grid;
        gap: var(--space-4);
        align-content: center;
      }

      .impact-metrics {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-3);
      }

      .metric {
        padding: var(--space-3);
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.02);
      }

      .metric strong {
        display: block;
        font-size: 1.35rem;
        color: var(--text);
      }

      .metric span {
        font-size: 0.8rem;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .stories {
        padding: var(--space-7) 0;
      }

      .story-grid {
        margin-top: var(--space-4);
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-3);
      }

      .story-card {
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.01);
        transition: transform 220ms ease, border-color 220ms ease;
      }

      .story-card:hover {
        transform: translateY(-6px);
        border-color: rgba(239, 111, 62, 0.45);
      }

      .story-card .kicker {
        color: var(--accent);
        font-size: 0.72rem;
        letter-spacing: 0.13em;
        text-transform: uppercase;
      }

      .story-card h3 {
        margin: var(--space-2) 0;
        font-size: 1.22rem;
        font-family: 'Cormorant Garamond', serif;
      }

      .story-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .footer {
        margin-top: var(--space-7);
        border-top: 1px solid var(--line);
        padding: var(--space-5) 0 var(--space-7);
      }

      .footer-grid {
        width: min(1200px, 92vw);
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-3);
        flex-wrap: wrap;
      }

      .footer p {
        margin: 0;
        color: var(--muted);
      }

      .reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 580ms ease, transform 580ms ease;
      }

      .reveal.in-view {
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 1024px) {
        .top-nav {
          padding: 0.66rem 0.9rem;
        }

        .nav-links {
          gap: 0.52rem;
        }

        .content-grid,
        .impact-strip {
          grid-template-columns: 1fr;
        }

        .program-grid,
        .story-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 768px) {
        .top-nav {
          top: 0.55rem;
          border-radius: 14px;
          width: min(96vw, 720px);
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
        }

        .hero-content {
          padding-top: 27vh;
        }

        .nav-main,
        .nav-account {
          display: none;
        }

        .nav-toggle {
          display: inline-flex;
          position: relative;
          z-index: 2;
        }

        .mobile-drawer {
          display: grid;
          grid-column: 1 / -1;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-8px);
          transition: max-height 360ms ease, opacity 260ms ease, transform 300ms ease;
        }

        .top-nav.menu-open .mobile-drawer {
          max-height: 580px;
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-group {
          display: grid;
          gap: 0.15rem;
          padding-top: 0.65rem;
        }

        .mobile-group + .mobile-group {
          margin-top: 0.4rem;
          padding-top: 0.6rem;
          border-top: 1px solid color-mix(in srgb, var(--nav-text) 16%, transparent);
        }

        .mobile-link {
          text-decoration: none;
          color: color-mix(in srgb, var(--nav-text) 90%, transparent);
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 0.75rem;
          padding: 0.5rem 0.1rem;
        }

        .mobile-link.active {
          color: var(--nav-accent);
        }

        .mobile-link.signup {
          width: fit-content;
          padding: 0.56rem 0.88rem;
          background: var(--nav-accent);
          border-radius: 999px;
          color: #1f1510;
          box-shadow: 0 8px 18px rgba(196, 98, 45, 0.36);
        }

        .nav-links {
          width: 100%;
          overflow: visible;
          white-space: normal;
          padding-bottom: 0;
        }

        .program-grid,
        .story-grid,
        .impact-metrics {
          grid-template-columns: 1fr;
        }

        .image-stack img,
        .image-stack img:last-child {
          height: 220px;
          grid-column: span 2;
        }

        .impact-content {
          padding: var(--space-4);
        }
      }
    `

    document.head.appendChild(styleTag)

    return () => {
      fontOne.remove()
      fontTwo.remove()
      fontThree.remove()
      styleTag.remove()
    }
  }, [])
}

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.reveal'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function TopNav({ pathname }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isLinkActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav className={`top-nav ${menuOpen ? 'menu-open' : ''}`} aria-label="Primary">
      <a className="brand" href="/">
        <span className="brand-mark" aria-hidden />
        <span className="brand-label">FARMBRIDGE</span>
      </a>
      <div className="nav-main">
        <div className="nav-links">
          {PRIMARY_NAV_LINKS.map((link) => (
            <a className={`nav-link ${isLinkActive(link.href) ? 'active' : ''}`} href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="nav-account">
        {ACCOUNT_NAV_LINKS.map((link) => (
          <a
            className={`nav-account-link ${
              link.key === 'login' ? 'nav-login' : link.key === 'signup' ? 'nav-signup' : 'nav-dashboard'
            }`}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </div>
      <button
        className="nav-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((state) => !state)}
      >
        <span />
      </button>

      <div className="mobile-drawer">
        <div className="mobile-group">
          {PRIMARY_NAV_LINKS.map((link) => (
            <a className={`mobile-link ${isLinkActive(link.href) ? 'active' : ''}`} href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="mobile-group">
          {ACCOUNT_NAV_LINKS.map((link) => (
            <a className={`mobile-link ${link.key === 'signup' ? 'signup' : ''}`} href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Hero({ pathname }) {
  const activePage = PAGE_LINKS.find((entry) =>
    entry.href === '/' ? pathname === '/' : pathname === entry.href || pathname.startsWith(`${entry.href}/`),
  )
  const pageLabel = activePage?.label ?? 'FarmBridge'

  return (
    <header className="hero">
      <div className="hero-content">
        <div className="eyebrow">US Agriculture Response Platform · {pageLabel}</div>
        <h1>Resilience for the farms that feed every community.</h1>
        <p>
          FarmBridge connects producers to urgent aid, local risk intelligence, and trusted field support with a
          modern, decisive experience designed for real-world action.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/programs">
            Explore Programs
          </a>
          <a className="btn btn-secondary" href="/support">
            Open Support Center
          </a>
        </div>
      </div>
    </header>
  )
}

function MissionSection() {
  return (
    <section className="section-wrap content-grid reveal" id="mission">
      <div>
        <div className="section-kicker">Our Approach</div>
        <h2 className="section-title">Editorial clarity meets practical field support.</h2>
        <p className="section-copy">
          Every flow is rebuilt around urgency and confidence: fewer distractions, stronger visual hierarchy, and
          focused pathways that help producers move from uncertainty to informed decisions quickly.
        </p>
      </div>
      <div className="image-stack">
        <img src={IMAGE_SET.soil} alt="Golden fields at sunset" />
        <img src={IMAGE_SET.hands} alt="Hands planting seeds into fresh soil" />
        <img src={IMAGE_SET.barn} alt="Rural barn in dramatic light" />
      </div>
    </section>
  )
}

function ProgramsSection() {
  return (
    <section className="section-wrap program-section reveal" id="programs">
      <div className="section-kicker">Core Platform</div>
      <h2 className="section-title">Every major FarmBridge page, redesigned with intent.</h2>
      <div className="program-grid">
        {PROGRAMS.map((item) => (
          <article className="program-card" key={item.title}>
            <img className="program-image" src={item.image} alt={item.title} />
            <div className="program-content">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ImpactSection() {
  return (
    <section className="impact-strip reveal" id="impact">
      <img className="impact-image" src={IMAGE_SET.greenhouse} alt="Greenhouse crop rows" />
      <div className="impact-content">
        <div>
          <div className="section-kicker">Nationwide Reach</div>
          <h2 className="section-title">Designed for action across all 50 states.</h2>
          <p className="section-copy">
            A renewed information architecture aligns eligibility, alerts, and support into one coherent system so
            every page feels connected, fast, and trustworthy.
          </p>
        </div>
        <div className="impact-metrics">
          <div className="metric">
            <strong>3.2M+</strong>
            <span>Acres In Focus</span>
          </div>
          <div className="metric">
            <strong>850+</strong>
            <span>Programs Indexed</span>
          </div>
          <div className="metric">
            <strong>1,600</strong>
            <span>Volunteer Signups</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StoriesSection() {
  return (
    <section className="section-wrap stories reveal" id="stories">
      <div className="section-kicker">Latest Recovery Stories</div>
      <h2 className="section-title">Field updates from communities rebuilding momentum.</h2>
      <div className="story-grid">
        {STORIES.map((story) => (
          <article className="story-card" key={story.title}>
            <div className="kicker">{story.kicker}</div>
            <h3>{story.title}</h3>
            <p>{story.copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <p>FarmBridge — Relief, guidance, and grounded decisions for American agriculture.</p>
        <p>Redesigned experience © 2026</p>
      </div>
    </footer>
  )
}

export default function Page() {
  const pathname = usePathname()
  useGlobalDesignSystem()
  useRevealOnScroll()

  return (
    <main className="site-shell" id="main-content">
      <TopNav pathname={pathname ?? '/'} />
      <Hero pathname={pathname ?? '/'} />
      <MissionSection />
      <ProgramsSection />
      <ImpactSection />
      <StoriesSection />
      <SiteFooter />
    </main>
  )
}
