'use client'

import { useEffect, useState } from 'react'
import styles from './DeadlineTimer.module.css'

interface DeadlineTimerProps {
  deadline: Date | string
  label?: string
  programName?: string
  compact?: boolean
}

export function DeadlineTimer({ deadline, label, programName, compact = false }: DeadlineTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const deadlineMs = deadline instanceof Date ? deadline.getTime() : new Date(deadline).getTime()

  useEffect(() => {
    if (!Number.isFinite(deadlineMs)) return

    const calc = () => {
      const diff = deadlineMs - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => { clearInterval(interval) }
  }, [deadlineMs])

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ]

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        {units.map(({ label: unitLabel, value }) => (
          <div key={unitLabel} className={styles.compactUnit}>
            <div className={styles.compactValue}>
              {String(value).padStart(2, '0')}
            </div>
            <div className={styles.compactLabel}>{unitLabel}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.indicator}>
            <span className={styles.indicatorDot} />
          </span>
          <span className={styles.headerLabel}>
            Urgent Deadline
          </span>
        </div>
        {programName && <p className={styles.programName}>{programName}</p>}

        <div className={styles.timerGrid}>
          {units.map(({ label, value }) => (
            <div key={label} className={styles.timerUnit}>
              <div className={styles.timerValueContainer}>
                <span className={styles.timerValue}>
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <span className={styles.timerLabel}>{label}</span>
            </div>
          ))}
        </div>

        {label && <p className={styles.footerLabel}>{label}</p>}
      </div>
    </div>
  )
}

