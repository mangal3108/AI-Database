'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Database, BarChart3, Users, Clock, AlertTriangle, ArrowRight, Check } from 'lucide-react'
import { SectionBackground } from '@/components/landing/section-background'

const PROBLEMS = [
  {
    icon: Clock,
    title: 'The SQL Bottleneck',
    description: 'Every data question requires a SQL developer. Teams wait hours or days for simple insights.',
  },
  {
    icon: Users,
    title: 'Data Scattered Everywhere',
    description: 'Databases, spreadsheets, BI tools. Everyone has their own version of the truth.',
  },
  {
    icon: AlertTriangle,
    title: 'BI Dashboards Rot',
    description: 'Dashboards are built once and never updated. They become obsolete before the quarter ends.',
  },
]

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 bg-[#080B10] relative overflow-hidden" ref={ref}>
      <SectionBackground theme="purple" opacity={0.3} />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your data shouldn&apos;t require a SQL expert.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every team needs answers from data. But getting those answers takes time, technical skills, and context that nobody has.
          </p>
        </motion.div>

        {/* Problems */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PROBLEMS.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
              <p className="text-slate-400 text-sm">{problem.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">The Solution</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Internite turns database questions into conversations.
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto mb-6">
            Connect your database once. Ask anything in plain English. Get instant answers with visualizations. No SQL required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Connect any database
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Ask in plain English
            </span>
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Visualize instantly
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
