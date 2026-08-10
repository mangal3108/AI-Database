'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code, BarChart3, Briefcase, Rocket, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SectionBackground } from './section-background'

const AUDIENCES = [
  {
    icon: Code,
    title: 'Developers',
    description: 'Debug and explore production data without writing repetitive SQL. Get instant answers during development.',
    useCase: '"Show me all users with failed payments today"',
    color: 'border-blue-500/30 hover:border-blue-500/60',
    iconColor: 'text-blue-400',
    badge: 'Ship faster',
  },
  {
    icon: BarChart3,
    title: 'Data Analysts',
    description: 'Skip the SQL export dance. Query any database, generate charts, and share insights in seconds.',
    useCase: '"Revenue by region for Q3 vs Q4"',
    color: 'border-emerald-500/30 hover:border-emerald-500/60',
    iconColor: 'text-emerald-400',
    badge: 'Work smarter',
  },
  {
    icon: Briefcase,
    title: 'Product Managers',
    description: 'Get answers to product questions without pinging engineering. Self-serve your data needs.',
    useCase: '"Daily active users trend for last 30 days"',
    color: 'border-purple-500/30 hover:border-purple-500/60',
    iconColor: 'text-purple-400',
    badge: 'Move faster',
  },
  {
    icon: Building2,
    title: 'Startups & SMBs',
    description: 'Get BI-tier insights without the BI-tier price tag. Your whole team can query data.',
    useCase: '"Top 10 customers by lifetime value"',
    color: 'border-amber-500/30 hover:border-amber-500/60',
    iconColor: 'text-amber-400',
    badge: 'Scale up',
  },
]

export function WhoIsThisFor() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background */}
      <SectionBackground theme="minimal" opacity={0.7} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} WHO_IT&apos;S_FOR
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for teams who query data
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            If your team asks &ldquo;can you pull that for me?&rdquo; more than twice a week, Internite AI is for you.
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {AUDIENCES.map((audience, i) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`group relative bg-slate-900/60 backdrop-blur-sm border rounded-2xl p-6 transition-all ${audience.color}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <audience.icon size={20} className={audience.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{audience.title}</h3>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-800/50 px-2 py-0.5 rounded-full">
                      {audience.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{audience.description}</p>
                  <div className="mt-3 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <p className="text-xs text-slate-500 font-mono">Example:</p>
                    <p className="text-xs text-slate-300 mt-0.5">{audience.useCase}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Start your free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
