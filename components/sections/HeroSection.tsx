'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

type HeroStat = {
  value: number
  suffix: string
  label: string
  prefix: string
}

const DEFAULT_STATS: HeroStat[] = [
  { value: 82, suffix: '', label: 'NC counties\nfederal disaster areas', prefix: '' },
  { value: 46, suffix: '%', label: 'rise in farm\nbankruptcies (2025)', prefix: '+' },
  { value: 50, suffix: '%', label: 'fertilizer price\nsurge (Iran war)', prefix: '+' },
  { value: 624.7, suffix: 'B', label: 'total US farm\ndebt (record)', prefix: '$' },
]

const HERO_IMAGES = {
  field:
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80',
}

export function HeroSection({ stats = DEFAULT_STATS }: { stats?: HeroStat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-ash"
    >
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\\'0 0 200 200\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cfilter id=\\\'noiseFilter\\\'%3E%3CfeTurbulence type=\\\'fractalNoise\\\' baseFrequency=\\\'0.65\\\' numOctaves=\\\'3\\\' stitchTiles=\\\'stitch\\\'/%3E%3C/filter%3E%3Crect width=\\\'100%25\\\' height=\\\'100%25\\\' filter=\\\'url(%23noiseFilter)\\\'/%3E%3C/svg%3E")',
          animation: 'grain 4s steps(8) infinite',
        }}
      />

      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-crisis/10 blur-[120px] animate-glow-shift" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-growth/8 blur-[100px] animate-glow-shift [animation-delay:700ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] rounded-full bg-ember/6 blur-[80px]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crisis opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-crisis" />
          </span>
          <span className="text-crisis font-mono text-xs uppercase tracking-[0.2em]">
            Crisis Response Platform · North Carolina · 2026
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-wheat leading-[0.92] tracking-tight mb-6"
            >
              NC Farmers
              <br />
              <span className="text-crisis italic">deserve to know</span>
              <br />
              what help exists.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-wheat/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-body"
            >
              100% of North Carolina is in drought. Fertilizer costs are up 50%. Federal relief
              programs exist - but most farmers don&apos;t know about them. FarmBridge changes that.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/eligibility"
                className="group relative px-8 py-4 bg-crisis text-parchment font-body font-semibold rounded-full text-sm tracking-wide overflow-hidden transition-all hover:shadow-crisis"
              >
                <span className="relative z-10">Check My Eligibility →</span>
                <span className="absolute inset-0 bg-ember opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/programs"
                className="px-8 py-4 border border-wheat/20 text-wheat font-body font-medium rounded-full text-sm tracking-wide hover:border-wheat/50 hover:bg-wheat/5 transition-all"
              >
                Browse All Programs
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden border border-wheat/15 bg-soil/30 shadow-card">
              <Image
                src={HERO_IMAGES.field}
                alt="North Carolina farmland landscape"
                width={900}
                height={700}
                className="w-full h-[420px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ash/80 via-ash/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-ash/65 border border-wheat/15 backdrop-blur-sm">
                <p className="text-wheat text-sm font-semibold">Regional drought + rising input costs</p>
                <p className="text-wheat/70 text-xs mt-1">Fast matching and urgent-deadline tracking for NC farms.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Crisis Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-wheat/10 rounded-2xl overflow-hidden"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-ash/80 px-6 py-5 group hover:bg-soil/30 transition-colors"
            >
              <div className="font-mono text-3xl font-bold text-wheat mb-1 tabular-nums">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                  duration={2500}
                />
              </div>
              <div className="text-wheat/40 text-xs leading-tight whitespace-pre-line">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

    </section>
  )
}
