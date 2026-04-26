import { createServerClient } from '@/lib/supabase/server'
import { ProgramCard } from '@/components/ui/ProgramCard'
import type { Database } from '@/lib/types/database.types'

type Program = Database['public']['Tables']['programs']['Row']

const CATEGORIES = [
  { value: 'all', label: 'All Programs' },
  { value: 'disaster_relief', label: '🚨 Disaster Relief' },
  { value: 'conservation', label: '🌱 Conservation' },
  { value: 'loan', label: '💰 Loans' },
  { value: 'commodity_support', label: '🌽 Commodity Support' },
  { value: 'mental_health', label: '💙 Mental Health' },
  { value: 'young_farmer', label: '🌾 Young Farmers' },
]

export default async function ProgramsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; urgent?: string }>
}) {
  const { category, urgent } = await searchParams
  const supabase = await createServerClient()

  let query = supabase
    .from('programs')
    .select('*')
    .eq('active', true)
    .order('is_urgent', { ascending: false })
    .order('deadline', { ascending: true, nullsFirst: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (urgent === 'true') {
    query = query.eq('is_urgent', true)
  }

  const { data: programs, error } = await query

  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Page header */}
        <div className="mb-12" style={{ animation: 'var(--animate-fade-up)' }}>
          <span className="text-crisis font-mono text-xs uppercase tracking-widest">
            Federal &amp; State Programs
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-wheat mt-2">
            Relief Programs for NC Farmers
          </h1>
          <p className="text-wheat/60 mt-3 max-w-xl">
            {programs?.length ?? 0} active programs. Many go unused because farmers
            don't know they exist. Find what you qualify for.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <a
              key={cat.value}
              href={cat.value === 'all' ? '/programs' : `/programs?category=${cat.value}`}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                (category ?? 'all') === cat.value
                  ? 'bg-crisis text-parchment'
                  : 'border border-wheat/20 text-wheat/60 hover:border-wheat/40 hover:text-wheat'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Urgent programs first */}
        {programs?.some(p => p.is_urgent) && (
          <div className="mb-8">
            <h2 className="text-crisis font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crisis opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-crisis" />
              </span>
              Time-Sensitive — Act Now
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {programs.filter(p => p.is_urgent).map(program => (
                <ProgramCard key={program.id} program={program} urgent />
              ))}
            </div>
          </div>
        )}

        {/* All programs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs?.filter(p => !p.is_urgent).map((program, i) => (
            <ProgramCard
              key={program.id}
              program={program}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
