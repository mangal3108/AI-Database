'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Database, Zap, Shield, Users } from 'lucide-react'
import { SectionBackground } from './section-background'

export function DatabaseTrustStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="py-12 relative overflow-hidden" ref={ref}>
      {/* Minimal Background */}
      <SectionBackground theme="minimal" opacity={0.5} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: Database, label: 'PostgreSQL', sublabel: 'MySQL • MongoDB' },
            { icon: Zap, label: 'Instant Setup', sublabel: 'Under 60 seconds' },
            { icon: Shield, label: 'Read-Only Mode', sublabel: 'By default' },
            { icon: Users, label: 'Team Ready', sublabel: 'Multi-user workspaces' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.label}</p>
                <p className="text-xs text-slate-500 truncate">{item.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
