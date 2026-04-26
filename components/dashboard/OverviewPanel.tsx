import Link from 'next/link'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { DeadlineTimer } from '@/components/ui/DeadlineTimer'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import styles from './OverviewPanel.module.css'

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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dashboard Overview</h1>
          <p>Manage applications, signups, and county support operations.</p>
        </div>
        <div>
          <Link href="/volunteer" className={styles.actionButton}>
            Open Volunteer Hub
          </Link>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Priority Programs ({savedPrograms?.length ?? 0})</h2>
          <div className={styles.programGrid}>
            {(savedPrograms ?? []).map((program: Program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Action Queue</h3>
            <ul className={styles.list}>
              {(actionQueue.length > 0 ? actionQueue : ['No urgent action queue items right now.']).map((task) => (
                <li key={task} className={styles.listItem}>
                  <span className={styles.listBullet}>●</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className={styles.section}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Upcoming Deadlines</h3>
            <div className={styles.deadlineList}>
              {(savedPrograms ?? []).map((program: Program) => (
                <div key={program.id} className={styles.deadlineItem}>
                  <p className={styles.deadlineName}>{program.name}</p>
                  {program.deadline ? (
                    <DeadlineTimer deadline={program.deadline} compact />
                  ) : (
                    <p className={styles.deadlineNone}>No deadline listed</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.updatePanel}>
            <h3 className={styles.panelTitle}>Recent Updates</h3>
            <ul className={styles.updateList}>
              {(updates.length > 0 ? updates : ['Dataset synced. No new county updates yet.']).map((item) => (
                <li key={item} className={styles.updateItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

