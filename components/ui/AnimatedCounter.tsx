'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value, prefix = '', suffix = '', decimals = 0,
  duration = 2000, className
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let timeoutId = 0
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setHasStarted(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    // Fallback: never leave values at 0 if observer doesn't trigger.
    timeoutId = window.setTimeout(() => setHasStarted(true), 1200)
    return () => {
      observer.disconnect()
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (!hasStarted) return
    // If the target is zero, render immediately.
    if (!Number.isFinite(value) || value === 0) {
      setDisplayValue(Number.isFinite(value) ? value : 0)
      return
    }
    const start = performance.now()
    let rafId = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(eased * value)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setDisplayValue(value)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [hasStarted, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
}
