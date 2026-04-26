'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

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
    <div className="max-w-2xl mx-auto">
      {/* Step progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs font-mono transition-all ${
              i < step ? 'bg-growth border-growth text-parchment' :
              i === step ? 'bg-crisis border-crisis text-parchment' :
              'border-wheat/20 text-wheat/30'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px transition-all ${i < step ? 'bg-growth' : 'bg-wheat/10'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 0: Location */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-wheat">{STEPS[0].title}</h2>
                <p className="text-wheat/50 text-sm mt-1">{STEPS[0].subtitle}</p>
              </div>
              <div>
                <label className="block text-wheat/70 text-xs font-mono uppercase tracking-widest mb-2">
                  NC County *
                </label>
                <select
                  {...register('county')}
                  className="w-full bg-soil/50 border border-wheat/20 text-wheat rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-crisis focus:ring-1 focus:ring-crisis"
                >
                  <option value="">Select your county...</option>
                  {countyOptions.map(c => <option key={c} value={c}>{c} County</option>)}
                </select>
                {errors.county && <p className="text-crisis text-xs mt-1">{errors.county.message}</p>}
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 bg-crisis text-parchment rounded-xl font-body font-semibold text-sm hover:bg-ember transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 1: Operation */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-wheat">{STEPS[1].title}</h2>
                <p className="text-wheat/50 text-sm mt-1">{STEPS[1].subtitle}</p>
              </div>

              <div>
                <label className="block text-wheat/70 text-xs font-mono uppercase tracking-widest mb-3">
                  What do you grow or raise? (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CROPS.map(crop => (
                    <button
                      key={crop.value}
                      type="button"
                      onClick={() => toggleCrop(crop.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                        crops.includes(crop.value)
                          ? 'bg-crisis text-parchment'
                          : 'border border-wheat/20 text-wheat/60 hover:border-wheat/40'
                      }`}
                    >
                      {crop.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-wheat/70 text-xs font-mono uppercase tracking-widest mb-2">
                  Farm Size (acres)
                </label>
                <input
                  {...register('farmSizeAcres', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 250"
                  className="w-full bg-soil/50 border border-wheat/20 text-wheat rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-crisis"
                />
              </div>

              <div>
                <label className="block text-wheat/70 text-xs font-mono uppercase tracking-widest mb-2">
                  Annual Farm Sales
                </label>
                <select
                  {...register('annualSalesBracket')}
                  className="w-full bg-soil/50 border border-wheat/20 text-wheat rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-crisis"
                >
                  <option value="">Select range...</option>
                  <option value="under_10k">Under $10,000</option>
                  <option value="10k_100k">$10,000 – $100,000</option>
                  <option value="100k_500k">$100,000 – $500,000</option>
                  <option value="500k_1m">$500,000 – $1 million</option>
                  <option value="over_1m">Over $1 million</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="px-6 py-3 border border-wheat/20 text-wheat/60 rounded-xl text-sm">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-crisis text-parchment rounded-xl font-semibold text-sm">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2: Situation */}
          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-wheat">{STEPS[2].title}</h2>
                <p className="text-wheat/50 text-sm mt-1">{STEPS[2].subtitle}</p>
              </div>

              <div className="space-y-4">
                {[
                  { field: 'hasExperiencedLoss', label: 'Have you experienced crop or livestock losses in 2023-2025?' },
                  { field: 'isBeginningFarmer', label: 'Are you a beginning farmer (farming for 10 years or fewer)?' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-start gap-3 p-4 border border-wheat/10 rounded-xl cursor-pointer hover:border-wheat/30 transition-colors">
                    <input
                      {...register(field as keyof EligibilityData)}
                      type="checkbox"
                      className="mt-0.5 accent-crisis w-4 h-4"
                    />
                    <span className="text-wheat/80 text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-wheat/70 text-xs font-mono uppercase tracking-widest mb-2">
                  Email (optional — for deadline alerts)
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-soil/50 border border-wheat/20 text-wheat rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-crisis placeholder:text-wheat/20"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border border-wheat/20 text-wheat/60 rounded-xl text-sm">← Back</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-crisis text-parchment rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                      Checking eligibility...
                    </>
                  ) : 'Find My Programs →'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-growth font-mono text-xs uppercase tracking-widest">Results</span>
                <h2 className="font-display text-2xl font-bold text-wheat mt-1">
                  You may qualify for {results.length} program{results.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <div className="space-y-3">
                {results.map((program) => (
                  <Link
                    key={program.id}
                    href={`/programs/${program.slug}`}
                    className="block p-4 bg-soil/30 border border-wheat/10 rounded-xl hover:border-crisis/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {program.is_urgent && (
                          <span className="text-crisis font-mono text-[10px] uppercase tracking-widest">⚡ Urgent</span>
                        )}
                        <h3 className="text-wheat font-semibold text-sm mt-0.5">{program.name}</h3>
                        <p className="text-wheat/50 text-xs mt-1 leading-relaxed">{program.summary}</p>
                      </div>
                      <span className="text-wheat/30 group-hover:text-crisis transition-colors mt-1">→</span>
                    </div>
                    {program.deadline_label && (
                      <div className="mt-2 text-xs font-mono text-ember">
                        Deadline: {program.deadline_label}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
              <Link
                href="/programs"
                className="block text-center py-3 border border-wheat/20 text-wheat/60 rounded-xl text-sm hover:border-wheat/40 transition-colors"
              >
                Browse All Programs
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
