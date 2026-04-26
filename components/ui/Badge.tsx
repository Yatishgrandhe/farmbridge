import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-mono uppercase tracking-widest ${className}`}>
      {children}
    </span>
  )
}
