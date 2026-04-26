import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DeadlineTimer } from '@/components/ui/DeadlineTimer'

export default async function ProgramDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!program) notFound()

  return (
    <main className="min-h-screen bg-ash">
      <article className="container mx-auto px-6 py-24 max-w-4xl">
        <Link href="/programs" className="text-wheat/50 font-mono text-sm hover:text-wheat mb-12 inline-block">
          ← Back to Programs
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-soil rounded-full font-mono text-[10px] text-wheat uppercase tracking-widest">
              {program.agency}
            </span>
            {program.is_urgent && (
              <span className="px-3 py-1 bg-crisis/20 text-crisis rounded-full font-mono text-[10px] uppercase tracking-widest">
                Urgent Priority
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-wheat mb-6">
            {program.name}
          </h1>
          <p className="text-xl text-wheat/80 leading-relaxed font-body">
            {program.summary}
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-wheat font-display text-2xl font-semibold mb-4 border-b border-wheat/10 pb-2">
                Program Details
              </h2>
              <div className="prose prose-invert prose-p:text-wheat/70 prose-a:text-growth">
                <div dangerouslySetInnerHTML={{ __html: program.description ?? '' }} />
              </div>
            </section>

            <section>
              <h2 className="text-wheat font-display text-2xl font-semibold mb-4 border-b border-wheat/10 pb-2">
                Eligibility Rules
              </h2>
              <pre className="bg-soil/50 p-4 rounded-xl text-wheat/70 font-mono text-sm whitespace-pre-wrap">
                {JSON.stringify(program.eligibility_rules, null, 2)}
              </pre>
            </section>
          </div>

          <aside className="space-y-6">
            {program.deadline && (
              <DeadlineTimer
                deadline={new Date(program.deadline)}
                label="Application Deadline"
                programName={program.acronym || program.name}
              />
            )}

            <div className="bg-soil/30 border border-wheat/10 rounded-2xl p-6">
              <h3 className="font-display text-wheat font-semibold mb-4">Quick Facts</h3>
              <dl className="space-y-4">
                {program.funding_amount && (
                  <div>
                    <dt className="text-wheat/50 font-mono text-[10px] uppercase tracking-widest">Funding</dt>
                    <dd className="text-growth font-mono text-lg">{program.funding_amount}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-wheat/50 font-mono text-[10px] uppercase tracking-widest">Category</dt>
                  <dd className="text-wheat">{program.category}</dd>
                </div>
                {program.apply_url && (
                  <div className="pt-4 mt-4 border-t border-wheat/10">
                    <a
                      href={program.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-wheat/10 hover:bg-wheat/20 text-wheat text-center rounded-xl font-semibold transition-colors"
                    >
                      Apply on {program.agency} →
                    </a>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
