'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Shield, Zap, Search, BarChart3, GitMerge } from 'lucide-react'
import { SectionBackground } from './section-background'

const FEATURES = [
  {
    icon: Brain,
    title: 'Semantic Schema Understanding',
    description:
      'AI analyzes your schema and generates business descriptions for every table and column — not just column names.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Search,
    title: 'Hybrid RAG Retrieval',
    description:
      'Vector similarity + keyword search + schema graph traversal ensures the right context reaches the AI every time.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Shield,
    title: 'Read-Only by Default',
    description:
      'All AI-generated queries are validated before execution. DROP, DELETE, UPDATE are blocked by the safety engine.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Zap,
    title: 'Streaming Responses',
    description:
      'See schema analysis, query generation, and results appear in real-time. No waiting for a single final response.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: BarChart3,
    title: 'Automatic Visualization',
    description:
      'AI selects the right chart type — bar, line, pie, KPI — based on your data structure and question context.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: GitMerge,
    title: 'Multi-Database Intelligence',
    description:
      'Switch between databases mid-conversation. Internite AI handles dialect differences automatically.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
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
          <div className="inline-block text-sm text-primary font-medium uppercase tracking-widest mb-4">
            Intelligence
          </div>
          <h2 className="heading-xl text-foreground mb-4">
            Not just a query builder.
            <br />
            A database intelligence layer.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Internite AI understands your data, not just your SQL. Built with real RAG,
            schema graphs, and a safety engine that keeps your data protected.
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
