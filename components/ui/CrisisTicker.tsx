'use client'

import { useRef } from 'react'

const TICKER_ITEMS = [
  '🚨 82 NC counties declared federal disaster areas · April 21, 2026',
  '🌵 100% of NC in drought · Worst in 131 years of record-keeping',
  '💰 Fertilizer prices up 50% due to Iran war / Strait of Hormuz closure',
  '📉 Farm bankruptcies up 46% in 2025 · 315 Chapter 12 filings nationally',
  '⏰ SDRP application deadline: December 10, 2026 · Apply now',
  '🌽 Corn costs $5.03/bushel to grow · Selling for under $4.00',
  '🔥 971+ field fires since statewide burn ban · March 28, 2026',
  '💧 47 NC counties in extreme drought · 95% in severe or worse',
]

export function CrisisTicker() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="bg-crisis text-parchment overflow-hidden py-2 border-b border-ember/30">
      <div
        ref={ref}
        className="flex whitespace-nowrap"
        style={{ animation: 'scroll-ticker 40s linear infinite' }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="font-mono text-xs px-8 tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
