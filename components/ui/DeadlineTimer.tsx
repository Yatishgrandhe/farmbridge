'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface DeadlineTimerProps {
  deadline: Date | string
  label?: string
  programName?: string
  compact?: boolean
}

export function DeadlineTimer({ deadline, label, programName, compact = false }: DeadlineTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isPulsing, setIsPulsing] = useState(false)
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
    const pulse = setInterval(() => setIsPulsing(p => !p), 2000)
    return () => { clearInterval(interval); clearInterval(pulse) }
  }, [deadlineMs])

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ]

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {units.map(({ label: unitLabel, value }) => (
          <div key={unitLabel} className="rounded-lg border border-wheat/20 bg-soil/50 px-2 py-2 text-center">
            <div className="font-mono text-lg font-bold text-wheat tabular-nums">
              {String(value).padStart(2, '0')}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-wheat/50">{unitLabel}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative bg-ash border border-ember/40 rounded-2xl p-6 overflow-hidden">
      {/* Pulsing background */}
      <motion.div
        className="absolute inset-0 bg-crisis/5 rounded-2xl"
        animate={{ opacity: isPulsing ? 0.8 : 0 }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crisis opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-crisis" />
          </span>
          <span className="text-crisis font-mono text-xs uppercase tracking-widest">
            Urgent Deadline
          </span>
        </div>
        {programName && <p className="text-wheat font-display text-lg font-semibold mb-4">{programName}</p>}

        <div className="flex gap-3">
          {units.map(({ label, value }) => (
            <div key={label} className="flex-1 text-center">
              <div className="bg-soil/50 rounded-xl py-3 px-2 mb-1">
                <motion.span
                  key={value}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="block font-mono text-2xl font-bold text-wheat tabular-nums"
                >
                  {String(value).padStart(2, '0')}
                </motion.span>
              </div>
              <span className="text-wheat/50 font-mono text-[9px] tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {label && <p className="mt-3 text-wheat/60 text-xs text-center">{label}</p>}
      </div>
    </div>
  )
}
