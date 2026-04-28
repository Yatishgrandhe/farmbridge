'use client'

import { useState } from 'react'
import { US_STATE_CODES } from '@/lib/data/usStates'
import styles from './ResourceSubmissionForm.module.css'

export function ResourceSubmissionForm() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submitResource = async (formData: FormData) => {
    setSubmitting(true)
    setMessage(null)

    const payload = {
      programName: formData.get('programName'),
      providerName: formData.get('providerName'),
      category: formData.get('category'),
      description: formData.get('description'),
      countyFips: null,
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode'),
      contactName: formData.get('contactName'),
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      websiteUrl: formData.get('websiteUrl'),
    }

    const res = await fetch('/api/resource-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    setSubmitting(false)
    setMessage(
      res.ok
        ? 'Resource submitted for review.'
        : typeof json.error === 'string'
          ? json.error
          : 'Unable to submit resource'
    )
  }

  return (
    <section id="submit-resource" className={styles.section}>
      <h2 className={styles.title}>Submit a Resource</h2>
      <p className={styles.lead}>
        Add a new support program so it can be reviewed and shown to farmers nationwide.
      </p>
      {message && <p className={styles.message}>{message}</p>}
      <form action={submitResource} className={styles.form}>
        <input
          name="programName"
          placeholder="Program or resource name"
          className={styles.input}
          required
        />
        <input name="providerName" placeholder="Provider organization" className={styles.input} />
        <input
          name="category"
          placeholder="Category (grants, labor, transport...)"
          className={`${styles.input} ${styles.span2}`}
        />
        <textarea
          name="description"
          placeholder="How this supports farms/programs"
          className={`${styles.textarea} ${styles.span2}`}
          required
        />
        <input name="address" placeholder="Address" className={styles.input} required />
        <input name="city" placeholder="City" className={styles.input} required />
        <select name="state" defaultValue="NC" className={styles.select} required>
          {US_STATE_CODES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <input name="zipCode" placeholder="ZIP code" className={styles.input} required />
        <input name="contactName" placeholder="Contact name" className={styles.input} required />
        <input name="contactEmail" placeholder="Contact email" className={styles.input} required />
        <input name="contactPhone" placeholder="Contact phone" className={styles.input} />
        <input name="websiteUrl" placeholder="Website URL" className={styles.input} />
        <button type="submit" disabled={submitting} className={`${styles.submit} ${styles.span2}`}>
          {submitting ? 'Submitting...' : 'Submit Resource'}
        </button>
      </form>
    </section>
  )
}
