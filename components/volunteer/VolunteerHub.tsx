'use client'

import { useMemo, useState } from 'react'

type CountyOption = { fips_code: string; name: string }

type Listing = {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  county_fips: string
  volunteer_date: string
  start_time: string
  end_time: string
  required_volunteers: number
  contact_name: string
  contact_email: string
  contact_phone: string | null
  listing_type: 'farm' | 'program'
  status: 'open' | 'closed' | 'cancelled'
}

interface VolunteerHubProps {
  counties: CountyOption[]
  initialListings: Listing[]
  canCreateListing: boolean
}

const DEFAULT_SIGNUP = {
  volunteerName: '',
  volunteerEmail: '',
  volunteerPhone: '',
  volunteerDate: '',
  startTime: '',
  endTime: '',
  declaredHours: '2',
}

export function VolunteerHub({ counties, initialListings, canCreateListing }: VolunteerHubProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'create-listing'>('browse')
  const [countyFilter, setCountyFilter] = useState('')
  const [zipFilter, setZipFilter] = useState('')
  const [listings, setListings] = useState(initialListings)
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)
  const [signupForm, setSignupForm] = useState(DEFAULT_SIGNUP)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === selectedListingId) ?? null,
    [listings, selectedListingId]
  )

  const visibleListings = useMemo(
    () =>
      listings.filter((listing) => {
        const countyOk = countyFilter ? listing.county_fips === countyFilter : true
        const zipOk = zipFilter ? listing.zip_code.startsWith(zipFilter) : true
        return countyOk && zipOk && listing.status === 'open'
      }),
    [listings, countyFilter, zipFilter]
  )

  const submitListing = async (formData: FormData) => {
    setMessage(null)
    setSubmitting(true)
    const payload = {
      listingType: formData.get('listingType'),
      title: formData.get('title'),
      description: formData.get('description'),
      countyFips: formData.get('countyFips'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode'),
      contactName: formData.get('contactName'),
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      volunteerDate: formData.get('volunteerDate'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      requiredVolunteers: formData.get('requiredVolunteers'),
      programId: null,
    }
    const res = await fetch('/api/volunteer-listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setMessage(typeof json.error === 'string' ? json.error : 'Unable to create listing')
      return
    }
    setListings((prev) => [json.listing, ...prev])
    setActiveTab('browse')
    setMessage('Listing created successfully.')
  }

  const submitSignup = async () => {
    if (!selectedListing) return
    setSubmitting(true)
    setMessage(null)
    const res = await fetch('/api/volunteer-signups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: selectedListing.id,
        ...signupForm,
      }),
    })
    const json = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setMessage(typeof json.error === 'string' ? json.error : 'Unable to sign up.')
      return
    }
    setMessage('Signup submitted. Hours will be credited after organization approval.')
    setSelectedListingId(null)
    setSignupForm(DEFAULT_SIGNUP)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'browse', label: 'Volunteer Opportunities' },
          ...(canCreateListing ? [{ id: 'create-listing', label: 'Create Listing' }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === tab.id ? 'bg-growth text-parchment' : 'border border-wheat/20 text-wheat/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-ember">{message}</p>}

      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="rounded-lg bg-soil/60 border border-wheat/20 px-3 py-2 text-sm text-wheat"
            >
              <option value="">All counties</option>
              {counties.map((county) => (
                <option key={county.fips_code} value={county.fips_code}>
                  {county.name}
                </option>
              ))}
            </select>
            <input
              value={zipFilter}
              onChange={(e) => setZipFilter(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Filter ZIP"
              className="rounded-lg bg-soil/60 border border-wheat/20 px-3 py-2 text-sm text-wheat"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {visibleListings.map((listing) => (
              <article key={listing.id} className="rounded-xl border border-wheat/10 bg-soil/45 p-4 space-y-2">
                <div className="flex justify-between gap-3">
                  <h3 className="text-wheat font-semibold">{listing.title}</h3>
                  <span className="text-[11px] uppercase font-mono text-wheat/55">{listing.listing_type}</span>
                </div>
                <p className="text-sm text-wheat/75">{listing.description}</p>
                <p className="text-xs text-wheat/55">
                  {listing.address}, {listing.city}, NC {listing.zip_code}
                </p>
                <p className="text-xs text-wheat/55">
                  {listing.volunteer_date} • {listing.start_time} - {listing.end_time} • Need {listing.required_volunteers}
                </p>
                <p className="text-xs text-wheat/55">
                  Contact: {listing.contact_name} ({listing.contact_email})
                </p>
                <button
                  onClick={() => setSelectedListingId(listing.id)}
                  className="mt-1 rounded-md bg-growth px-3 py-1.5 text-xs text-parchment font-semibold"
                >
                  Volunteer for this
                </button>
              </article>
            ))}
          </div>

          {selectedListing && (
            <div className="rounded-xl border border-growth/35 bg-growth/10 p-4 space-y-3">
              <h4 className="text-wheat font-semibold">Sign up for: {selectedListing.title}</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={signupForm.volunteerName}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerName: e.target.value }))}
                  placeholder="Full name"
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <input
                  value={signupForm.volunteerEmail}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerEmail: e.target.value }))}
                  placeholder="Email"
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <input
                  value={signupForm.volunteerPhone}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerPhone: e.target.value }))}
                  placeholder="Phone"
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <input
                  type="date"
                  value={signupForm.volunteerDate}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerDate: e.target.value }))}
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <input
                  type="time"
                  value={signupForm.startTime}
                  onChange={(e) => setSignupForm((v) => ({ ...v, startTime: e.target.value }))}
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <input
                  type="time"
                  value={signupForm.endTime}
                  onChange={(e) => setSignupForm((v) => ({ ...v, endTime: e.target.value }))}
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <input
                  type="number"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={signupForm.declaredHours}
                  onChange={(e) => setSignupForm((v) => ({ ...v, declaredHours: e.target.value }))}
                  placeholder="Declared hours"
                  className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={submitSignup}
                  disabled={submitting}
                  className="rounded-md bg-growth px-4 py-2 text-xs text-parchment font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Signup'}
                </button>
                <button
                  onClick={() => setSelectedListingId(null)}
                  className="rounded-md border border-wheat/20 px-4 py-2 text-xs text-wheat/75"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create-listing' && canCreateListing && (
        <form
          action={submitListing}
          className="rounded-xl border border-wheat/10 bg-soil/45 p-5 grid md:grid-cols-2 gap-3"
        >
          <select name="listingType" defaultValue="farm" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat">
            <option value="farm">Farm manpower need</option>
            <option value="program">Program manpower need</option>
          </select>
          <input name="title" placeholder="Listing title" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
          <textarea name="description" placeholder="Describe the volunteer need" className="md:col-span-2 rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat min-h-24" required />
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
          <input type="date" name="volunteerDate" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
          <input type="time" name="startTime" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
          <input type="time" name="endTime" className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
          <input type="number" name="requiredVolunteers" min={1} defaultValue={5} className="rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat" required />
          <button
            disabled={submitting}
            className="md:col-span-2 rounded-lg bg-growth px-4 py-2.5 text-sm text-parchment font-semibold disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      )}
    </div>
  )
}
