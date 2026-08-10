'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, BarChart3, Database, Brain, Zap, Shield, BookOpen, Code2, GitBranch, Users } from 'lucide-react'

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Database Chat',
    description: 'Ask questions in plain English. Internite AI understands your schema, generates safe SQL, and explains results.',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Natural Language',
  },
  {
    icon: BarChart3,
    title: 'Data Visualizer',
    description: 'Turn query results into beautiful charts instantly. Line, bar, area, pie, scatter, KPI, and more.',
    color: 'from-purple-500 to-pink-500',
    badge: '8 Chart Types',
  },
  {
    icon: Database,
    title: 'Multi-Database',
    description: 'Connect PostgreSQL, MySQL, MongoDB, SQL Server, SQLite, and more. Switch databases mid-conversation.',
    color: 'from-emerald-500 to-teal-500',
    badge: '10 Databases',
  },
  {
    icon: Brain,
    title: 'Knowledge RAG',
    description: 'Upload documents, define business terminology. AI uses your knowledge for accurate, context-aware queries.',
    color: 'from-orange-500 to-amber-500',
    badge: 'Hybrid RAG',
  },
  {
    icon: Shield,
    title: 'Query Safety',
    description: 'Read-only by default. DROP, DELETE, UPDATE blocked. Every query validated before execution.',
    color: 'from-red-500 to-rose-500',
    badge: 'AES-256 Encrypted',
  },
  {
    icon: Zap,
    title: 'Streaming Results',
    description: 'Watch queries execute in real-time. See schema analysis, SQL generation, and results as they appear.',
    color: 'from-yellow-500 to-orange-500',
    badge: 'Real-time',
  },
  {
    icon: Code2,
    title: 'Developer API',
    description: 'RESTful API with webhooks. Integrate AI database capabilities into your own applications.',
    color: 'from-indigo-500 to-violet-500',
    badge: 'REST API',
  },
  {
    icon: GitBranch,
    title: 'Dashboards',
    description: 'Save visualizations, build dashboards, schedule reports. Create decision-ready views of your data.',
    color: 'from-cyan-500 to-blue-500',
    badge: 'BI Dashboards',
  },
]

export function FeatureShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">POWERFUL FEATURES</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Everything you need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              talk to your data
            </span>
          </h2>
          <p className="text-slate-400 text-base mt-4 max-w-2xl mx-auto">
            From natural language queries to beautiful dashboards, Internite AI handles the complexity so you can focus on insights.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-[#0D111A]/80 border border-slate-800/60 rounded-2xl p-6 hover:border-slate-700/80 transition-all duration-300"
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Badge */}
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 mb-3">
                {feature.badge}
              </span>

              {/* Content */}
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
