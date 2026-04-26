import { EligibilityWizard } from '@/components/forms/EligibilityWizard'

export const metadata = {
  title: 'Check Eligibility | FarmBridge',
  description: 'Find federal relief programs for North Carolina farmers.',
}

export default function EligibilityPage() {
  return (
    <main className="min-h-screen bg-ash flex flex-col justify-center py-20 px-6">
      <div className="container mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-growth font-mono text-xs uppercase tracking-widest">
            Personalized Matching
          </span>
          <h1 className="font-display text-4xl font-bold text-wheat mt-2 mb-4">
            Find the support you need.
          </h1>
          <p className="text-wheat/60 font-body">
            Answer a few quick questions. We'll cross-reference your county, crops, and situation against 100+ active federal and state agricultural relief programs.
          </p>
        </div>
        <EligibilityWizard />
      </div>
    </main>
  )
}
