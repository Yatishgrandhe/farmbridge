import Link from 'next/link'
import type { Database } from '@/lib/types/database.types'
import styles from './ProgramCard.module.css'

type Program = Database['public']['Tables']['programs']['Row']

interface ProgramCardProps {
  program: Program
  urgent?: boolean
  style?: React.CSSProperties
}

export function ProgramCard({ program, urgent, style }: ProgramCardProps) {
  const cardClassName = `${styles.card} ${urgent ? styles.cardUrgent : ''}`

  return (
    <Link
      href={`/programs/${program.slug}`}
      style={style}
      className={cardClassName}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.meta}>
            <span className={styles.agency}>
              {program.agency}
            </span>
            {urgent && <span className={styles.urgentBadge}>URGENT</span>}
          </div>
          <h3 className={styles.title}>
            {program.name} {program.acronym && `(${program.acronym})`}
          </h3>
        </div>
      </div>
      
      <p className={styles.summary}>
        {program.summary}
      </p>
      
      <div className={styles.footer}>
        {program.deadline_label && (
          <div className={`${styles.footerItem} ${urgent ? styles.deadlineUrgent : styles.deadline}`}>
            <span className={styles.footerLabel}>Deadline</span>
            <span className={styles.footerValue}>{program.deadline_label}</span>
          </div>
        )}
        {program.funding_amount && (
          <div className={`${styles.footerItem} ${styles.funding}`}>
            <span className={styles.footerLabel}>Funding</span>
            <span className={styles.footerValue}>{program.funding_amount}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
