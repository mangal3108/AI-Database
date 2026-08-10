'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Shield, Zap, Search, BarChart3, GitMerge } from 'lucide-react'
import { SectionBackground } from './section-background'

const FEATURES = [
  {
    icon: Brain,
    title: 'Understands your business data',
    description:
      'Not just table names. Internite maps what every field actually represents in your business — so questions like "monthly revenue" return the right answer.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    tech: 'Semantic Schema Understanding',
  },
  {
    icon: Search,
    title: 'Finds the right context every time',
    description:
      'Before generating SQL, Internite retrieves exactly the tables, columns, and relationships that answer your question — nothing more, nothing less.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    tech: 'Hybrid RAG Retrieval',
  },
  {
    icon: Shield,
    title: 'Your data is always safe',
    description:
      'Every generated query is validated before execution. DROP, DELETE, UPDATE, TRUNCATE — all blocked by default. Write access is never granted automatically.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    tech: 'Read-Only by Default',
  },
  {
    icon: Zap,
    title: 'Results in real-time, not batches',
    description:
      'Watch schema analysis, query generation, and results stream live. No spinning loader, no waiting for a final response.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    tech: 'Streaming Responses',
  },
  {
    icon: BarChart3,
    title: 'Charts appear automatically',
    description:
      'Internite picks the right visualization — bar, line, pie, or KPI card — based on what your data and question actually call for.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    tech: 'Automatic Chart Selection',
  },
  {
    icon: GitMerge,
    title: 'Switch databases mid-conversation',
    description:
      'Work across PostgreSQL, MySQL, MongoDB, and more from a single workspace. Internite handles SQL dialect differences automatically.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    tech: 'Multi-Database Intelligence',
  },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 px-6 bg-[#050505] relative overflow-hidden" ref={ref}>
      <SectionBackground theme="green" opacity={0.35} />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-3">
            Intelligence
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Internite understands your{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              business data.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Not just tables. Not just SQL. It understands relationships, context, and what your question actually means.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group p-6 bg-card/50 border border-border/50 rounded-2xl hover:border-border hover:bg-card transition-all duration-300"
            >
              <div className={`w-10 h-10 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={20} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              <p className="mt-3 text-[10px] font-mono text-slate-600">{feature.tech}</p>
            </motion.div>
          ))}
        </div>

        {/* Architecture link for developers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <a
            href="#architecture"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2"
          >
            Want the technical details? View architecture
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
