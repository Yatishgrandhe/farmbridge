'use client'

import { useState } from 'react'

type CountyOption = { fips_code: string; name: string }

export function ResourceSubmissionForm({ counties }: { counties: CountyOption[] }) {
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
      countyFips: formData.get('countyFips'),
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
    setMessage(res.ok ? 'Resource submitted for review.' : typeof json.error === 'string' ? json.error : 'Unable to submit resource')
  }

  return (
    <section id="submit-resource" className="rounded-2xl border border-growth/25 bg-growth/10 p-6">
      <h2 className="font-display text-3xl text-wheat mb-2">Submit a Resource</h2>
      <p className="text-wheat/70 text-sm mb-5">
        Add a new support program so it can be reviewed and shown to farmers statewide.
      </p>
      {message && <p className="text-sm text-ember mb-3">{message}</p>}
      <form action={submitResource} className="grid md:grid-cols-2 gap-3">
        <input name="programName" placeholder="Program or resource name" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="providerName" placeholder="Provider organization" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" />
        <input name="category" placeholder="Category (grants, labor, transport...)" className="md:col-span-2 rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" />
        <textarea name="description" placeholder="How this supports farms/programs" className="md:col-span-2 rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat min-h-24" required />
        <select name="countyFips" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required>
          <option value="">Select county</option>
          {counties.map((county) => (
            <option key={county.fips_code} value={county.fips_code}>
              {county.name}
            </option>
          ))}
        </select>
        <input name="address" placeholder="Address" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="city" placeholder="City" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="state" defaultValue="NC" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="zipCode" placeholder="NC ZIP code" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="contactName" placeholder="Contact name" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="contactEmail" placeholder="Contact email" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
        <input name="contactPhone" placeholder="Contact phone" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" />
        <input name="websiteUrl" placeholder="Website URL" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" />
        <button
          disabled={submitting}
          className="md:col-span-2 rounded-lg bg-growth px-4 py-2.5 text-sm text-parchment font-semibold disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Resource'}
        </button>
      </form>
    </section>
  )
}
