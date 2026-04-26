import Link from 'next/link'

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
    <footer className="border-t border-ember/20 bg-soil/65">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 surface-panel p-8 md:p-10">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl text-wheat font-bold mb-3">FarmBridge</h2>
            <p className="text-wheat/78 text-sm max-w-md leading-relaxed">
              A North Carolina-first relief navigation platform helping farmers identify eligible
              funding, track hard deadlines, and access local support quickly.
            </p>
          </div>

          <div>
            <h3 className="text-wheat font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.platform.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-wheat/70 hover:text-ember transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-wheat font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-wheat/70 hover:text-ember transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ember/15 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="text-wheat/40 text-xs font-mono uppercase tracking-wider">
            2026 FarmBridge - Built for NC Agricultural Resilience
          </p>
          <p className="text-wheat/50 text-xs">Not affiliated with USDA, NCDA&CS, or SBA.</p>
        </div>
      </div>
    </footer>
  )
}
