import Link from 'next/link'
import type { Database } from '@/lib/types/database.types'
import { Badge } from '@/components/ui/Badge'

type Program = Database['public']['Tables']['programs']['Row']

interface ProgramCardProps {
  program: Program
  urgent?: boolean
  style?: React.CSSProperties
}

export function ProgramCard({ program, urgent, style }: ProgramCardProps) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      style={style}
      className={`group relative overflow-hidden block p-6 rounded-[1.6rem_1rem_1.6rem_1rem] border transition-all duration-300 hover:-translate-y-1 ${
        urgent
          ? 'bg-crisis/8 border-crisis/45 hover:border-crisis/70 shadow-card'
          : 'bg-soil/35 border-wheat/15 hover:border-ember/40 shadow-card'
      }`}
    >
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-wheat/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer-sweep" />
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-wheat/50 font-mono text-xs uppercase tracking-widest">
              {program.agency}
            </span>
            {urgent && (
              <Badge className="bg-crisis text-parchment px-2 py-0.5 font-bold tracking-normal">Urgent</Badge>
            )}
          </div>
          <h3 className="text-xl font-display font-bold text-wheat group-hover:text-parchment transition-colors">
            {program.name} {program.acronym && `(${program.acronym})`}
          </h3>
        </div>
      </div>
      
      <p className="text-wheat/70 text-sm leading-relaxed mb-6 line-clamp-3">
        {program.summary}
      </p>
      
      <div className="flex flex-col gap-2 mt-auto">
        {program.deadline_label && (
          <div className={`text-xs font-mono flex items-center gap-2 ${urgent ? 'text-crisis' : 'text-wheat/50'}`}>
            <span className="text-[0.65rem] uppercase tracking-widest text-wheat/45">Deadline</span>
            <span>{program.deadline_label}</span>
          </div>
        )}
        {program.funding_amount && (
          <div className="text-xs font-mono text-growth flex items-center gap-2">
            <span className="text-[0.65rem] uppercase tracking-widest text-wheat/45">Funding</span>
            <span>{program.funding_amount}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
