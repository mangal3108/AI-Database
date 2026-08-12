'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, BarChart2, Database, ShieldCheck, Zap } from 'lucide-react'

const FEATURES = [
  {
    title: 'Natural Language Queries',
    description: 'Ask questions in plain English. No SQL required.',
    icon: MessageSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-100/50',
    cardBg: 'bg-[#f8faff]',
  },
  {
    title: 'Smart Visualizations',
    description: 'Get beautiful charts and graphs automatically.',
    icon: BarChart2,
    color: 'text-blue-500',
    bg: 'bg-blue-100/50',
    cardBg: 'bg-[#f4f9ff]',
  },
  {
    title: 'Multi-Database Support',
    description: 'Connect and chat with multiple databases.',
    icon: Database,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100/50',
    cardBg: 'bg-[#f2fbf6]',
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared.',
    icon: ShieldCheck,
    color: 'text-amber-500',
    bg: 'bg-amber-100/50',
    cardBg: 'bg-[#fef9f3]',
  },
  {
    title: 'Real-time Answers',
    description: 'Get accurate answers from live data instantly.',
    icon: Zap,
    color: 'text-pink-500',
    bg: 'bg-pink-100/50',
    cardBg: 'bg-[#fff5f8]',
  },
]

export function LightFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-4 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Everything you need to unlock your data
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className={`flex-1 min-w-[280px] max-w-[340px] p-8 rounded-3xl ${feature.cardBg} border border-white/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all`}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
