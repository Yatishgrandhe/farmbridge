import Link from 'next/link'
import { ToolkitChecklists } from '@/components/toolkit/ToolkitChecklists'
import styles from './toolkit.module.css'

const FILING_STEPS = [
  {
    title: 'Confirm the program and deadline',
    body:
      'Use FarmBridge program listings for agency, payment type, and deadline labels. Copy the official program name exactly when opening accounts or calling county offices.',
  },
  {
    title: 'Run eligibility once, then refine',
    body:
      'Walk the eligibility wizard with real acreage and entity type so you do not chase programs you cannot legally qualify for.',
  },
  {
    title: 'Assemble documents before touching the portal',
    body:
      'Most delays are incomplete packets. Finish the checklist sections below, then scan once at readable resolution.',
  },
  {
    title: 'File through the official channel',
    body:
      'Submit only through USDA, state, or lender portals linked from the program record. Avoid third-party “fast track” forms that are not agency-hosted.',
  },
  {
    title: 'Capture proof of submission',
    body:
      'Save confirmation numbers, uploaded file names, and timestamps. If the portal fails, your county office can sometimes accept a controlled follow-up.',
  },
  {
    title: 'Track weather and policy updates',
    body:
      'Subscribe to county-level alerts and re-check FarmBridge when disaster declarations expand; new counties may unlock contiguous benefits.',
  },
]

const AUTHORITY_LINKS = [
  {
    href: 'https://www.fsa.usda.gov/state-offices/North-Carolina/index',
    title: 'USDA FSA: North Carolina',
    tag: 'Federal',
    desc: 'County Service Center locator, farm records, and program enrollment tied to many relief pathways.',
  },
  {
    href: 'https://www.ncagr.gov/',
    title: 'NCDA&CS',
    tag: 'State',
    desc: 'North Carolina Department of Agriculture & Consumer Services news, producer resources, and state program context.',
  },
  {
    href: 'https://www.weather.gov/',
    title: 'National Weather Service',
    tag: 'Weather',
    desc: 'Official watches and warnings to correlate loss events with documented storm or freeze windows.',
  },
  {
    href: 'https://www.drought.gov/',
    title: 'National Integrated Drought Information System',
    tag: 'Drought',
    desc: 'County-scale drought indicators that pair with precipitation logs when programs ask for environmental stress.',
  },
]

const INTERNAL_TOOLS = [
  { href: '/programs', label: 'Program index' },
  { href: '/eligibility', label: 'Eligibility wizard' },
  { href: '/alerts', label: 'Saved alerts' },
  { href: '/volunteer', label: 'Volunteer hub' },
  { href: '/support', label: 'Support' },
  { href: '/resources', label: 'Resource center' },
]

export default function OperationalToolkitPage() {
  return (
    <main className={styles.page}>
      <header className={`${styles.hero} animate-on-scroll`}>
        <div className={styles.heroInner}>
          <p className="label">FIELD OPERATIONS</p>
          <h1 className="display-lg">Operational toolkit</h1>
          <p className="body-lg">
            Practical prep for NC producers: what to gather, in what order, and where to file, without drowning in PDFs.
          </p>
        </div>
      </header>

      <div className={styles.wrap}>
        <ToolkitChecklists />

        <section className={`${styles.sectionBlock} animate-on-scroll`} aria-labelledby="filing-workflow">
          <h2 id="filing-workflow" className={`display-md ${styles.sectionTitle}`}>
            Recommended filing workflow
          </h2>
          <p className={`body-md ${styles.sectionLead}`}>
            These steps mirror how county agents and lenders review packets. They are not legal advice; always follow the
            official program handbook.
          </p>
          <ol className={styles.steps}>
            {FILING_STEPS.map((step) => (
              <li key={step.title} className={styles.step}>
                <div className={styles.stepBody}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${styles.sectionBlock} animate-on-scroll`} aria-labelledby="authority-links">
          <h2 id="authority-links" className={`display-md ${styles.sectionTitle}`}>
            Trusted sources (open in new tab)
          </h2>
          <p className={`body-md ${styles.sectionLead}`}>
            FarmBridge summarizes programs; agencies publish final rules. Bookmark these for authoritative forms and
            county contacts.
          </p>
          <div className={styles.linkGrid}>
            {AUTHORITY_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.linkCard}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.linkCardMeta}>{item.tag}</span>
                <span className={styles.linkCardTitle}>{item.title}</span>
                <span className={styles.linkCardDesc}>{item.desc}</span>
                <span className={styles.spanRow}>Visit →</span>
              </a>
            ))}
          </div>
        </section>

        <section className={`${styles.sectionBlock} animate-on-scroll`} aria-labelledby="farmbridge-shortcuts">
          <h2 id="farmbridge-shortcuts" className={`display-md ${styles.sectionTitle}`}>
            FarmBridge shortcuts
          </h2>
          <p className={`body-md ${styles.sectionLead}`}>Jump back into the tools this site runs day-to-day.</p>
          <div className={styles.internalGrid}>
            {INTERNAL_TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className={styles.tile}>
                {t.label}
              </Link>
            ))}
          </div>
        </section>

        <p className={`${styles.disclaimer} animate-on-scroll`}>
          FarmBridge does not submit applications on your behalf. Tooling here is educational. Verify every requirement
          with the program administrator or county office before relying on deadlines shown in any third-party system.
        </p>
      </div>
    </main>
  )
}
