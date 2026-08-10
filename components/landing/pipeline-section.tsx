'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Database, MessageSquare, Brain, Code, CheckCircle, BarChart3, Lightbulb, ArrowRight } from 'lucide-react'
import { SectionBackground } from './section-background'

const PIPELINE_STEPS = [
  {
    icon: Database,
    title: 'Connect',
    description: 'PostgreSQL, MySQL, MongoDB, SQL Server and more',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Ask',
    description: 'Type your question in plain English',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Brain,
    title: 'Understand',
    description: 'AI analyzes your schema and context',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code,
    title: 'Query',
    description: 'Safe SQL generated and validated',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: CheckCircle,
    title: 'Answer',
    description: 'Accurate results returned instantly',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Visualize',
    description: 'Automatic charts and dashboards',
    color: 'from-orange-500 to-amber-500',
  },
]

export function PipelineSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background with subtle green tint */}
      <SectionBackground theme="green" opacity={0.7} />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} HOW_IT_WORKS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From question to decision in seconds
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Internite AI connects to your database, understands your schema, and generates accurate SQL — all automatically.
          </p>
        </motion.div>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5 text-center hover:border-emerald-500/30 transition-all">
                <div
                  className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${step.color}`}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                <p className="text-[10px] text-slate-500 leading-tight">{step.description}</p>
              </div>

              {/* Arrow between items (desktop) */}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Insight Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 rounded-full px-5 py-3">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-300">
              Plus AI-generated insights that explain what your data means
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
