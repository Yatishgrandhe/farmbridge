'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './ToolkitChecklists.module.css'

const STORAGE_KEY = 'farmbridge-toolkit-checklists-v1'

export type ChecklistGroup = {
  id: string
  title: string
  description: string
  items: { id: string; label: string }[]
}

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    id: 'prep',
    title: 'Before you start an application',
    description:
      'Gathering these items once saves weeks of back-and-forth with agencies and lenders. Check items off as you locate them.',
    items: [
      { id: 'operator', label: 'Legal operator name matches tax & farm records (individual, LLC, or partnership docs)' },
      { id: 'ein', label: 'EIN letter or SSN verification (only share through official secure portals)' },
      { id: 'acreage', label: 'Farm tract map or FSA acreage/crop acreage history if you have it' },
      { id: 'lease', label: 'Lease or deed showing control of land for the crop year in question' },
      { id: 'insurance', label: 'Crop insurance policy number and agent contact (if applicable)' },
      { id: 'tax', label: 'Prior-year Schedule F or comparable farm income documentation' },
      { id: 'bank', label: 'Operating account info for ACH (routing/account on file with your institution)' },
      { id: 'loss', label: 'Photos or dated notes documenting loss event (weather, drought, flood timing)' },
    ],
  },
  {
    id: 'week',
    title: 'Week you submit',
    description: 'Final checks so your packet is complete on first submission.',
    items: [
      { id: 'deadline', label: 'Confirmed program deadline in your timezone + backup calendar reminder' },
      { id: 'portal', label: 'Account created on the correct agency portal (password saved securely)' },
      { id: 'pdf', label: 'PDFs under upload size limits; scanned pages legible and upright' },
      { id: 'narrative', label: 'Short narrative of loss tied to dates (even bullet points help reviewers)' },
      { id: 'contacts', label: 'County NRCS/FSA phone numbers saved in case the portal stalls' },
    ],
  },
  {
    id: 'follow',
    title: 'After you submit',
    description: 'Protect your eligibility window and appeal rights.',
    items: [
      { id: 'confirm', label: 'Confirmation / reference number saved (screenshot or email folder)' },
      { id: 'sla', label: 'Expected response window noted; follow-up date on calendar' },
      { id: 'appeal', label: 'Appeal deadline captured if status is partial denial or “incomplete”' },
      { id: 'updates', label: 'FarmBridge alerts or county bulletins subscribed for policy changes' },
    ],
  },
]

function loadState(): Record<string, Record<string, boolean>> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, Record<string, boolean>>
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function ToolkitChecklists() {
  const [checked, setChecked] = useState<Record<string, Record<string, boolean>>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setChecked(loadState())
    setMounted(true)
  }, [])

  const persist = useCallback((next: Record<string, Record<string, boolean>>) => {
    setChecked(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore quota */
    }
  }, [])

  const toggle = useCallback(
    (groupId: string, itemId: string, value: boolean) => {
      const next = {
        ...checked,
        [groupId]: {
          ...(checked[groupId] ?? {}),
          [itemId]: value,
        },
      }
      persist(next)
    },
    [checked, persist],
  )

  const clearGroup = useCallback(
    (groupId: string) => {
      const next = { ...checked, [groupId]: {} }
      persist(next)
    },
    [checked, persist],
  )

  const resetAll = useCallback(() => {
    persist({})
  }, [persist])

  return (
    <section className={styles.section} aria-labelledby="toolkit-checklists-heading">
      <div className={styles.sectionHead}>
        <h2 id="toolkit-checklists-heading" className="display-md">
          Interactive checklists
        </h2>
        <p className="body-md">
          Progress saves in this browser only (not on our servers). Use “Clear section” if you share a workstation.
        </p>
        {!mounted ? (
          <p className={styles.hint}>Loading your saved checks…</p>
        ) : (
          <div className={styles.toolbar}>
            <button type="button" className={styles.ghostBtn} onClick={resetAll}>
              Reset all checklists
            </button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {CHECKLIST_GROUPS.map((group) => {
          const groupChecked = checked[group.id] ?? {}
          const total = group.items.length
          const done = group.items.filter((it) => groupChecked[it.id]).length

          return (
            <article key={group.id} className={styles.card}>
              <header className={styles.cardHead}>
                <div>
                  <h3 className={styles.cardTitle}>{group.title}</h3>
                  <p className={styles.cardDesc}>{group.description}</p>
                </div>
                <div className={styles.progress}>
                  <span className={styles.progressLabel}>
                    {done}/{total}
                  </span>
                  <button type="button" className={styles.linkish} onClick={() => clearGroup(group.id)}>
                    Clear section
                  </button>
                </div>
              </header>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <label className={styles.row}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={Boolean(groupChecked[item.id])}
                        onChange={(e) => toggle(group.id, item.id, e.target.checked)}
                      />
                      <span className={styles.labelText}>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
