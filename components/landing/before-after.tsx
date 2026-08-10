'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { X, Check, ArrowDown, Clock } from 'lucide-react'
import { SectionBackground } from './section-background'

const BEFORE_STEPS = [
  'CEO asks question',
  'Slack message to analyst',
  'Analyst opens database',
  'Writes SQL query',
  'Fixes SQL errors',
  'Exports to CSV',
  'Creates Excel chart',
  'Sends screenshot',
]

const AFTER_STEPS = [
  'Ask a question',
  'AI queries database',
  'Answer + SQL + Chart',
]

export function BeforeAfterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background with purple tint */}
      <SectionBackground theme="purple" opacity={0.7} />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} THE_DIFFERENCE
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop waiting. Start deciding.
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Every hour your team spends on data requests is an hour not spent on your product.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Without Internite AI</h3>
                <p className="text-xs text-slate-500">The slow path</p>
              </div>
            </div>

            <div className="space-y-3">
              {BEFORE_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-400">
                    {i + 1}
                  </div>
                  <span className="text-sm text-slate-400">{step}</span>
                  {i < BEFORE_STEPS.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-slate-600 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-red-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">45+ minutes later...</span>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px]" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">With Internite AI</h3>
                  <p className="text-xs text-slate-500">The fast path</p>
                </div>
              </div>

              <div className="space-y-3">
                {AFTER_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-300">{step}</span>
                    {i < AFTER_STEPS.length - 1 && (
                      <ArrowDown className="w-4 h-4 text-emerald-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center gap-2 text-emerald-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">30 seconds later...</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-lg font-semibold text-white mb-2">
            That&apos;s something people will pay for.
          </p>
          <p className="text-slate-400 mb-6">
            Stop the meeting chains. Start getting answers.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
