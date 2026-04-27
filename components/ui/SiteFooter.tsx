import Link from 'next/link'
import styles from './SiteFooter.module.css'

const footerLinks = {
  platform: [
    { href: '/programs', label: 'Relief Programs' },
    { href: '/eligibility', label: 'Eligibility Wizard' },
    { href: '/dashboard', label: 'Farmer Dashboard' },
    { href: '/alerts', label: 'County Alerts' },
  ],
  resources: [
    { href: '/resources', label: 'Application Toolkit' },
    { href: '/support', label: 'Support Center' },
    { href: '/impact', label: 'Impact Data' },
    { href: '/about', label: 'About FarmBridge' },
  ],
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandColumn}>
            <h2 className={styles.brandTitle}><span className={styles.dot} /> FARMBRIDGE</h2>
            <p className={styles.brandDescription}>
              A North Carolina-first relief navigation platform helping farmers identify eligible funding, track hard deadlines, and access local support quickly.
            </p>
            <p className={styles.bottomTag}>2026 FarmBridge — Built for NC Agricultural Resilience</p>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>PLATFORM</h3>
            <ul className={styles.linkList}>
              {footerLinks.platform.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.linkItem}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>RESOURCES</h3>
            <ul className={styles.linkList}>
              {footerLinks.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.linkItem}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>Not affiliated with USDA, NCDA&CS, or SBA. · Crisis Response Platform · United States · 2026</div>
      </div>
    </footer>
  )
}
