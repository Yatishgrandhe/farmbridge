import Link from 'next/link'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { DeadlineTimer } from '@/components/ui/DeadlineTimer'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Program = Database['public']['Tables']['programs']['Row']

export async function OverviewPanel() {
  const supabase = await createServerClient()
  const [{ data: savedPrograms }, { data: latestCounties }, { data: urgentPrograms }] = await Promise.all([
    supabase.from('programs').select('*').eq('active', true).order('is_urgent', { ascending: false }).limit(4),
    supabase.from('counties').select('name,updated_at').order('updated_at', { ascending: false }).limit(3),
    supabase.from('programs').select('name,deadline_label').eq('active', true).eq('is_urgent', true).limit(3),
  ])

  const actionQueue = (urgentPrograms ?? []).map(
    (program) => `Review ${program.name} requirements and submit before ${program.deadline_label ?? 'deadline'}.`
  )
  const updates = (latestCounties ?? []).map(
    (county) => `${county.name} county data refreshed ${county.updated_at ? 'recently' : 'in latest load'}.`
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-10 border-b border-wheat/10 pb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wheat mb-2">Dashboard Overview</h1>
          <p className="text-wheat/60 font-body">Manage applications, signups, and county support operations.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="/volunteer" className="px-5 py-2.5 bg-wheat/10 text-wheat hover:bg-wheat hover:text-ash font-body rounded-full transition-colors text-sm font-semibold">
            Open Volunteer Hub
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <h2 className="font-display text-2xl font-bold text-wheat">Priority Programs ({savedPrograms?.length ?? 0})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(savedPrograms ?? []).map((program: Program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          <div className="bg-soil border border-wheat/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-wheat mb-4">Action Queue</h3>
            <ul className="space-y-3">
              {(actionQueue.length > 0 ? actionQueue : ['No urgent action queue items right now.']).map((task) => (
                <li key={task} className="text-sm text-wheat/80 flex items-start gap-2">
                  <span className="text-growth mt-0.5">●</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-soil border border-wheat/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-wheat mb-6">Upcoming Deadlines</h3>
            <div className="space-y-6">
              {(savedPrograms ?? []).map((program: Program) => (
                <div key={program.id} className="space-y-2">
                  <p className="font-body text-sm text-wheat/80 font-medium">{program.name}</p>
                  {program.deadline ? (
                    <DeadlineTimer deadline={program.deadline} compact />
                  ) : (
                    <p className="text-xs text-wheat/50 font-mono">No deadline listed</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ash border border-wheat/10 rounded-2xl p-6">
            <h3 className="font-display text-xl font-bold text-wheat mb-4">Recent Updates</h3>
            <ul className="space-y-3">
              {(updates.length > 0 ? updates : ['Dataset synced. No new county updates yet.']).map((item) => (
                <li key={item} className="text-xs text-wheat/65 border-l border-wheat/20 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
