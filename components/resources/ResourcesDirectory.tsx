'use client'

import { useMemo, useState } from 'react'
import type { Database } from '@/lib/types/database.types'
import styles from './ResourcesDirectory.module.css'

type Resource = Database['public']['Tables']['resources']['Row']
type County = { fips_code: string; name: string }

function typeLabel(t: string | null) {
  if (!t) return 'Resource'
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ResourcesDirectory({
  resources,
  counties,
}: {
  resources: Resource[]
  counties: County[]
}) {
  const [countyFips, setCountyFips] = useState<string>('')
  const [query, setQuery] = useState('')
  const [zipInput, setZipInput] = useState('')
  const [zipHint, setZipHint] = useState<string | null>(null)

  const nameByFips = useMemo(
    () => new Map(counties.map((c) => [c.fips_code, c.name] as const)),
    [counties]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return resources.filter((r) => {
      if (countyFips && r.county_fips !== countyFips) return false
      if (!q) return true
      const name = (r.name ?? '').toLowerCase()
      const city = (r.address ?? '').toLowerCase()
      const type = (r.type ?? '').toLowerCase()
      return name.includes(q) || city.includes(q) || type.includes(q)
    })
  }, [resources, countyFips, query])

  async function handleZipDigits(next: string) {
    const digits = next.replace(/\D/g, '').slice(0, 5)
    setZipInput(digits)
    setZipHint(null)
    if (digits.length !== 5) return
    try {
      const res = await fetch(`/api/public/zip-lookup?zip=${encodeURIComponent(digits)}`)
      const body = await res.json()
      const fips = body.match?.countyFips as string | undefined
      const cname = body.match?.countyName as string | undefined
      if (fips) {
        setCountyFips(fips)
        setZipHint(`ZIP ${digits} → ${cname ?? 'North Carolina county'}`)
      } else {
        setZipHint(`No NC ZIP ${digits} in lookup table`)
      }
    } catch {
      setZipHint('Could not look up ZIP')
    }
  }

  return (
    <section className={styles.wrap} id="directory">
      <div className={styles.toolbar}>
        <div className={styles.field}>
          <label className="label" htmlFor="res-search">
            Search
          </label>
          <input
            id="res-search"
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, type, or address"
            type="search"
            autoComplete="off"
          />
        </div>
        <div className={styles.field}>
          <label className="label" htmlFor="res-zip">
            ZIP → county
          </label>
          <input
            id="res-zip"
            className={styles.input}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="28202"
            maxLength={5}
            value={zipInput}
            onChange={(e) => void handleZipDigits(e.target.value)}
          />
          {zipHint ? <p className={styles.zipHint}>{zipHint}</p> : null}
        </div>
        <div className={styles.field}>
          <label className="label" htmlFor="res-county">
            County
          </label>
          <select
            id="res-county"
            className={styles.select}
            value={countyFips}
            onChange={(e) => {
              setCountyFips(e.target.value)
              setZipInput('')
              setZipHint(null)
            }}
          >
            <option value="">All counties</option>
            {counties.map((c) => (
              <option key={c.fips_code} value={c.fips_code}>
                {c.name.replace(/ County$/, '')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className={styles.resultCount}>
        Showing <strong>{filtered.length}</strong> of {resources.length} offices and centers
      </p>

      <ul className={styles.list}>
        {filtered.map((r) => (
          <li key={r.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.typeBadge}>{typeLabel(r.type)}</span>
              {r.county_fips ? (
                <span className={styles.county}>{nameByFips.get(r.county_fips) ?? r.county_fips}</span>
              ) : null}
            </div>
            <h3 className={styles.cardTitle}>{r.name}</h3>
            {r.address ? <p className={styles.meta}>{r.address}</p> : null}
            <div className={styles.links}>
              {r.phone ? (
                <a href={`tel:${r.phone.replace(/\s/g, '')}`} className={styles.link}>
                  {r.phone}
                </a>
              ) : null}
              {r.website_url ? (
                <a href={r.website_url} className={styles.link} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              ) : null}
              {r.email ? (
                <a href={`mailto:${r.email}`} className={styles.link}>
                  Email
                </a>
              ) : null}
            </div>
            {r.hours ? <p className={styles.hours}>{r.hours}</p> : null}
            {r.notes ? <p className={styles.notes}>{r.notes}</p> : null}
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? <p className={styles.empty}>No resources match your filters.</p> : null}
    </section>
  )
}
