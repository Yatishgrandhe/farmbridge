'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import styles from './EligibilityWizard.module.css'

const CROPS = [
  { value: 'corn', label: 'Corn' },
  { value: 'soy', label: 'Soybeans' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'tobacco', label: 'Tobacco' },
  { value: 'sweet_potato', label: 'Sweet Potatoes' },
  { value: 'hogs', label: 'Hogs / Pork' },
  { value: 'poultry', label: 'Poultry' },
  { value: 'christmas_trees', label: 'Christmas Trees' },
  { value: 'fruits_vegetables', label: 'Fruits & Vegetables' },
  { value: 'hay_forage', label: 'Hay / Forage' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'other', label: 'Other' },
]

const eligibilitySchema = z.object({
  county: z.string().min(1, 'Please select your county'),
  crops: z.array(z.string()).min(1, 'Select at least one crop or livestock type'),
  farmSizeAcres: z.number().min(1, 'Enter farm size').max(100000),
  annualSalesBracket: z.enum(['under_10k','10k_100k','100k_500k','500k_1m','over_1m']),
  hasExperiencedLoss: z.boolean(),
  isBeginningFarmer: z.boolean(),
  age: z.number().min(18).max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
})

type EligibilityData = z.infer<typeof eligibilitySchema>
type ProgramResult = {
  id: string
  slug: string
  is_urgent: boolean | null
  name: string
  summary: string
  deadline_label: string | null
}

const STEPS = [
  { id: 'location', title: 'Your Location', subtitle: 'Help us find county-specific programs' },
  { id: 'operation', title: 'Your Operation', subtitle: 'Tell us about your farm' },
  { id: 'situation', title: 'Your Situation', subtitle: 'Have you experienced losses?' },
  { id: 'results', title: 'Your Programs', subtitle: "Here's what you qualify for" },
]
const LOCATION_STEP = STEPS[0]!
const OPERATION_STEP = STEPS[1]!
const SITUATION_STEP = STEPS[2]!

interface EligibilityWizardProps {
  countyOptions: string[]
}

export function EligibilityWizard({ countyOptions }: EligibilityWizardProps) {
  const [step, setStep] = useState(0)
  const [results, setResults] = useState<ProgramResult[]>([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EligibilityData>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: { crops: [], hasExperiencedLoss: false, isBeginningFarmer: false }
  })

  const crops = watch('crops')

  const toggleCrop = (value: string) => {
    const current = watch('crops')
    setValue('crops', current.includes(value)
      ? current.filter(c => c !== value)
      : [...current, value]
    )
  }

  const onSubmit = async (data: EligibilityData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const { programs } = await res.json() as { programs: ProgramResult[] }
      setResults(programs)
      setStep(3)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wizardContainer}>
      {/* Step progress */}
      <div className={styles.stepProgress}>
        {STEPS.map((s, i) => (
          <div key={s.id} className={styles.stepWrapper}>
            <div className={styles.stepInfo}>
              <div className={`${styles.stepCircle} ${
                i < step ? styles.stepCircleCompleted :
                i === step ? styles.stepCircleActive :
                styles.stepCircleUpcoming
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <p className={styles.stepTitle}>{s.title}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`${styles.stepLine} ${i < step ? styles.stepLineCompleted : styles.stepLineUpcoming}`} />
            )}
          </div>
        ))}
      </div>

      <div className={styles.fadeEnter}>
        {/* Step 0: Location */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>{LOCATION_STEP.title}</h2>
              <p className={styles.subtitle}>{LOCATION_STEP.subtitle}</p>
            </div>
            <div>
              <label htmlFor="eligibility-county" className={styles.label}>
                NC County *
              </label>
              <select
                id="eligibility-county"
                {...register('county')}
                className={styles.input}
              >
                <option value="">Select your county...</option>
                {countyOptions.map(c => <option key={c} value={c}>{c} County</option>)}
              </select>
              {errors.county && <p className={styles.errorText}>{errors.county.message}</p>}
            </div>
            <button
              onClick={() => setStep(1)}
              className={styles.primaryButton}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 1: Operation */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>{OPERATION_STEP.title}</h2>
              <p className={styles.subtitle}>{OPERATION_STEP.subtitle}</p>
            </div>

            <div>
              <label className={styles.label}>
                What do you grow or raise? (select all that apply)
              </label>
              <div className={styles.pillList}>
                {CROPS.map(crop => (
                  <button
                    key={crop.value}
                    type="button"
                    onClick={() => toggleCrop(crop.value)}
                    className={`${styles.pill} ${crops.includes(crop.value) ? styles.pillActive : styles.pillInactive}`}
                  >
                    {crop.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="eligibility-farm-size-acres" className={styles.label}>
                Farm Size (acres)
              </label>
              <input
                id="eligibility-farm-size-acres"
                {...register('farmSizeAcres', { valueAsNumber: true })}
                type="number"
                placeholder="e.g. 250"
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor="eligibility-sales-bracket" className={styles.label}>
                Annual Farm Sales
              </label>
              <select
                id="eligibility-sales-bracket"
                {...register('annualSalesBracket')}
                className={styles.input}
              >
                <option value="">Select range...</option>
                <option value="under_10k">Under $10,000</option>
                <option value="10k_100k">$10,000 - $100,000</option>
                <option value="100k_500k">$100,000 - $500,000</option>
                <option value="500k_1m">$500,000 - $1 million</option>
                <option value="over_1m">Over $1 million</option>
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <button onClick={() => setStep(0)} className={styles.secondaryButton}>← Back</button>
              <button onClick={() => setStep(2)} className={styles.primaryButton}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Situation */}
        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className={styles.stepContent}>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>{SITUATION_STEP.title}</h2>
              <p className={styles.subtitle}>{SITUATION_STEP.subtitle}</p>
            </div>

            <div className={styles.checkboxGroup}>
              {[
                { field: 'hasExperiencedLoss', label: 'Have you experienced crop or livestock losses in 2023-2025?' },
                { field: 'isBeginningFarmer', label: 'Are you a beginning farmer (farming for 10 years or fewer)?' },
              ].map(({ field, label }) => (
                <label key={field} className={styles.checkboxLabel}>
                  <input
                    {...register(field as keyof EligibilityData)}
                    type="checkbox"
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label htmlFor="eligibility-email" className={styles.label}>
                Email (optional, for deadline alerts)
              </label>
              <input
                id="eligibility-email"
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                className={styles.input}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => setStep(1)} className={styles.secondaryButton}>← Back</button>
              <button
                type="submit"
                disabled={loading}
                className={styles.primaryButton}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Checking eligibility...
                  </>
                ) : 'Find My Programs →'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.titleGroup}>
              <span className={styles.resultTag} style={{ color: 'var(--safe)' }}>
                Results
              </span>
              <h2 className={styles.title}>
                You may qualify for {results.length} program{results.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className={styles.resultsList}>
              {results.map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  className={styles.resultCard}
                >
                  <div className={styles.resultHeader}>
                    <div>
                      {program.is_urgent && (
                        <span className={styles.resultTag}>⚡ Urgent</span>
                      )}
                      <h3 className={styles.resultTitle}>{program.name}</h3>
                      <p className={styles.resultSummary}>{program.summary}</p>
                    </div>
                    <span className={styles.resultArrow}>→</span>
                  </div>
                  {program.deadline_label && (
                    <div className={styles.resultDeadline}>
                      Deadline: {program.deadline_label}
                    </div>
                  )}
                </Link>
              ))}
            </div>
            <Link
              href="/programs"
              className={styles.browseButton}
            >
              Browse All Programs
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
