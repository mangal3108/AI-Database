'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SectionBackground } from './section-background'

const CAPABILITIES: Array<{
  name: string
  internite: boolean | 'partial'
  manual: boolean | 'partial'
  generic: boolean | 'partial'
}> = [
  { name: 'Natural language queries', internite: true, manual: false, generic: 'partial' },
  { name: 'Direct database connection', internite: true, manual: true, generic: 'partial' },
  { name: 'SQL generation', internite: true, manual: false, generic: 'partial' },
  { name: 'MongoDB support', internite: true, manual: true, generic: 'partial' },
  { name: 'Query safety layer', internite: true, manual: false, generic: 'partial' },
  { name: 'Data visualization', internite: true, manual: false, generic: 'partial' },
  { name: 'AI insights', internite: true, manual: false, generic: 'partial' },
  { name: 'Schema awareness', internite: true, manual: false, generic: 'partial' },
  { name: 'Multi-database support', internite: true, manual: false, generic: 'partial' },
]

export function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="comparison" className="py-24 px-6 relative" ref={ref}>
      {/* Minimal Background with cyan tint */}
      <SectionBackground theme="cyan" opacity={0.6} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} COMPARISON
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How does it compare?
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            See why Internite AI is the better choice for database querying.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-800/50 bg-slate-900/80">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Feature</div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider text-center">Internite AI</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Manual SQL</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider text-center">Generic AI</div>
          </div>

          {/* Table Rows */}
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.name}
              className="grid grid-cols-4 gap-4 p-4 border-b border-slate-800/30 last:border-0 hover:bg-slate-800/20 transition-colors"
            >
              <div className="text-sm text-slate-300">{cap.name}</div>
              <div className="flex justify-center">
                <CapabilityIndicator value={cap.internite} />
              </div>
              <div className="flex justify-center">
                <CapabilityIndicator value={cap.manual} />
              </div>
              <div className="flex justify-center">
                <CapabilityIndicator value={cap.generic} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Try Internite AI free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function CapabilityIndicator({ value }: { value: boolean | 'partial' }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-emerald-400" />
  }
  if (value === 'partial') {
    return <Minus className="w-5 h-5 text-amber-400" />
  }
  return <XIcon />
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
