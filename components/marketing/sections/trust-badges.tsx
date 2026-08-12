'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Lock, Zap, Clock, Code, HeartHandshake } from 'lucide-react'

const BADGES = [
  { icon: Lock, title: 'End-to-end Encryption' },
  { icon: Zap, title: 'Lightning Fast' },
  { icon: Clock, title: '99.9% Uptime' },
  { icon: Code, title: 'Easy Integration' },
  { icon: HeartHandshake, title: 'Active Support' },
]

export function TrustBadges() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="py-12 border-t border-slate-200 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {BADGES.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <badge.icon size={16} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{badge.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
