'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProgramCard } from '@/components/ui/ProgramCard'
import { DeadlineTimer } from '@/components/ui/DeadlineTimer'

export default function DashboardPage() {
  // Mock data for the dashboard since we don't have user auth fully hooked up for specific users yet
  const savedPrograms = [
    {
      id: 'sdrp-2026',
      title: 'State Drought Relief Program (SDRP)',
      description: 'Emergency block grants for NC farmers experiencing 50%+ yield loss.',
      agency: 'NCDA&CS',
      deadline: '2026-12-10T23:59:59Z',
      maxAmount: 150000,
      matchPercentage: 98,
      isUrgent: true,
      slug: 'sdrp-2026',
    },
    {
      id: 'eqip-emergency',
      title: 'EQIP Emergency Assistance',
      description: 'Immediate funding for livestock water infrastructure and soil stabilization.',
      agency: 'NRCS',
      deadline: '2026-11-30T23:59:59Z',
      maxAmount: 50000,
      matchPercentage: 85,
      isUrgent: false,
      slug: 'eqip-emergency',
    }
  ]

  const actionQueue = [
    'Upload Schedule F draft for SDRP review',
    'Book extension office slot for acreage validation',
    'Submit EQIP pre-application before Thursday 5 PM',
  ]

  const updates = [
    'Sampson county declaration updated 2 hours ago',
    'New conservation micro-grant added to your profile',
    'Deadline reminder email sent for SDRP',
  ]

  return (
    <div className="container mx-auto px-6 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12 border-b border-wheat/10 pb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-wheat mb-2">Farmer Dashboard</h1>
            <p className="text-wheat/60 font-body">Manage your applications and track eligibility.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <Link href="/eligibility" className="px-6 py-3 bg-wheat/10 text-wheat hover:bg-wheat hover:text-ash font-body rounded-full transition-colors text-sm font-semibold">
              Retake Eligibility Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-display text-2xl font-bold text-wheat">Saved Programs ({savedPrograms.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPrograms.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>

            <div className="bg-soil border border-wheat/10 rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-wheat mb-4">Action Queue</h3>
              <ul className="space-y-3">
                {actionQueue.map((task) => (
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
                {savedPrograms.map(program => (
                  <div key={program.id} className="space-y-2">
                    <p className="font-body text-sm text-wheat/80 font-medium">{program.title}</p>
                    <DeadlineTimer deadline={program.deadline} compact />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-crisis/10 border border-crisis/30 rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-crisis mb-2">Missing Information</h3>
              <p className="text-wheat/70 font-body text-sm mb-4">
                You need to upload your 2025 Schedule F to apply for the SDRP program.
              </p>
              <button className="w-full py-2 bg-crisis text-parchment rounded-md font-body text-sm font-semibold transition-transform active:scale-95">
                Upload Document
              </button>
            </div>

            <div className="bg-ash border border-wheat/10 rounded-2xl p-6">
              <h3 className="font-display text-xl font-bold text-wheat mb-4">Recent Updates</h3>
              <ul className="space-y-3">
                {updates.map((item) => (
                  <li key={item} className="text-xs text-wheat/65 border-l border-wheat/20 pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
