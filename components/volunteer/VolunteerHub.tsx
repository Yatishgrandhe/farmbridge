'use client'

import { useMemo, useState } from 'react'
import { US_STATE_CODES } from '@/lib/data/usStates'
import styles from './VolunteerHub.module.css'

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
      countyFips: null,
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
    <div className={styles.hub}>
      <div className={styles.tabs}>
        {[
          { id: 'browse', label: 'Volunteer Opportunities' },
          ...(canCreateListing ? [{ id: 'create-listing', label: 'Create Listing' }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : styles.tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {activeTab === 'browse' && (
        <div className={styles.browseSection}>
          <div className={styles.filters}>
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className={styles.select}
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
              className={styles.input}
            />
          </div>

          <div className={styles.listingGrid}>
            {visibleListings.map((listing) => (
              <article key={listing.id} className={styles.listingCard}>
                <div className={styles.listingHeader}>
                  <h3 className={styles.listingTitle}>{listing.title}</h3>
                  <span className={styles.listingTag}>{listing.listing_type}</span>
                </div>
                <p className={styles.listingDesc}>{listing.description}</p>
                <p className={styles.listingMeta}>
                  {listing.address}, {listing.city}, {listing.state} {listing.zip_code}
                </p>
                <p className={styles.listingMeta}>
                  {listing.volunteer_date} • {listing.start_time} - {listing.end_time} • Need {listing.required_volunteers}
                </p>
                <p className={styles.listingMeta}>
                  Contact: {listing.contact_name} ({listing.contact_email})
                </p>
                <button
                  onClick={() => setSelectedListingId(listing.id)}
                  className={styles.volunteerButton}
                >
                  Volunteer for this
                </button>
              </article>
            ))}
          </div>

          {selectedListing && (
            <div className={styles.signupForm}>
              <h4 className={styles.signupTitle}>Sign up for: {selectedListing.title}</h4>
              <div className={styles.signupGrid}>
                <input
                  value={signupForm.volunteerName}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerName: e.target.value }))}
                  placeholder="Full name"
                  className={styles.input}
                />
                <input
                  value={signupForm.volunteerEmail}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerEmail: e.target.value }))}
                  placeholder="Email"
                  className={styles.input}
                />
                <input
                  value={signupForm.volunteerPhone}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerPhone: e.target.value }))}
                  placeholder="Phone"
                  className={styles.input}
                />
                <input
                  type="date"
                  value={signupForm.volunteerDate}
                  onChange={(e) => setSignupForm((v) => ({ ...v, volunteerDate: e.target.value }))}
                  className={styles.input}
                />
                <input
                  type="time"
                  value={signupForm.startTime}
                  onChange={(e) => setSignupForm((v) => ({ ...v, startTime: e.target.value }))}
                  className={styles.input}
                />
                <input
                  type="time"
                  value={signupForm.endTime}
                  onChange={(e) => setSignupForm((v) => ({ ...v, endTime: e.target.value }))}
                  className={styles.input}
                />
                <input
                  type="number"
                  min={0.5}
                  max={24}
                  step={0.5}
                  value={signupForm.declaredHours}
                  onChange={(e) => setSignupForm((v) => ({ ...v, declaredHours: e.target.value }))}
                  placeholder="Declared hours"
                  className={`${styles.input} ${styles.fullWidth}`}
                />
              </div>
              <div className={styles.signupActions}>
                <button
                  onClick={submitSignup}
                  disabled={submitting}
                  className={styles.signupSubmit}
                >
                  {submitting ? 'Submitting...' : 'Submit Signup'}
                </button>
                <button
                  onClick={() => setSelectedListingId(null)}
                  className={styles.signupCancel}
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
          className={styles.createForm}
        >
          <select name="listingType" defaultValue="farm" className={styles.select}>
            <option value="farm">Farm manpower need</option>
            <option value="program">Program manpower need</option>
          </select>
          <input name="title" placeholder="Listing title" className={styles.input} required />
          <textarea name="description" placeholder="Describe the volunteer need" className={`${styles.input} ${styles.textarea} ${styles.fullWidth}`} required />
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
          <input type="date" name="volunteerDate" className={styles.input} required />
          <input type="time" name="startTime" className={styles.input} required />
          <input type="time" name="endTime" className={styles.input} required />
          <input type="number" name="requiredVolunteers" min={1} defaultValue={5} className={styles.input} required />
          <button
            disabled={submitting}
            className={`${styles.createButton} ${styles.fullWidth}`}
          >
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      )}
    </div>
  )
}
