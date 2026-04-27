import Link from 'next/link'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { DeadlineTimer } from '@/components/ui/DeadlineTimer'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { Activity, Clock, Layers, Zap } from 'lucide-react'
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
          <p className="label">COMMAND CENTER</p>
          <h1>Intelligence Overview</h1>
          <p className="body-md">Real-time operational monitoring of relief flows, county risks, and application queues.</p>
        </div>
        <div>
          <Link href="/volunteer" className={styles.actionButton}>
            VOLUNTEER HUB →
          </Link>
        </div>
      </header>

      <div className={styles.grid}>
        <section>
          <h2 className={styles.sectionTitle}>
            <Layers size={18} />
            PRIORITY PROGRAMS ({savedPrograms?.length ?? 0})
          </h2>
          <div className={styles.programGrid}>
            {(savedPrograms ?? []).map((program: Program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              <span>COMMAND FEED</span>
              <Activity size={14} />
            </h3>
            <ul className={styles.list}>
              {(actionQueue.length > 0 ? actionQueue : ['Operational status normal. No urgent actions required.']).map((task) => (
                <li key={task} className={styles.listItem}>
                  <span className={styles.listBullet}>•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              <span>UPCOMING DEADLINES</span>
              <Clock size={14} />
            </h3>
            <div className={styles.deadlineList}>
              {(savedPrograms ?? []).map((program: Program) => (
                <div key={program.id} className={styles.deadlineItem}>
                  <p className={styles.deadlineName}>{program.name}</p>
                  {program.deadline ? (
                    <DeadlineTimer deadline={program.deadline} compact />
                  ) : (
                    <p className={styles.deadlineNone}>No critical deadline listed</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.updatePanel}>
            <h3 className={styles.panelTitle}>
              <span>NETWORK UPDATES</span>
              <Zap size={14} />
            </h3>
            <ul className={styles.updateList}>
              {(updates.length > 0 ? updates : ['All nodes reporting stable. County sync complete.']).map((item) => (
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
