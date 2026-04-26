'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

export function SplineShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-[360px] md:h-[460px] rounded-2xl overflow-hidden border border-wheat/10 bg-ash"
    >
      <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
    </motion.div>
  )
}
