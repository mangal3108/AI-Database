'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Shield, Database, BarChart3, History, Globe, Code, Zap } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: string
}

interface ProductFeaturesProps {
  title?: string
  subtitle?: string
  features: Feature[]
  theme?: 'blue' | 'purple' | 'green' | 'cyan' | 'amber'
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Shield,
  Database,
  BarChart3,
  History,
  Globe,
  Code,
  Zap,
}

const THEME_STYLES = {
  blue: { gradient: 'from-blue-500/20 to-cyan-500/20', icon: 'text-cyan-400', border: 'hover:border-blue-500/40' },
  purple: { gradient: 'from-purple-500/20 to-pink-500/20', icon: 'text-purple-400', border: 'hover:border-purple-500/40' },
  green: { gradient: 'from-emerald-500/20 to-cyan-500/20', icon: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
  cyan: { gradient: 'from-cyan-500/20 to-blue-500/20', icon: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
  amber: { gradient: 'from-amber-500/20 to-orange-500/20', icon: 'text-amber-400', border: 'hover:border-amber-500/40' },
}

export function ProductFeatures({ title = 'Features', subtitle, features, theme = 'blue' }: ProductFeaturesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const styles = THEME_STYLES[theme]

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || MessageSquare
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className={`group p-6 rounded-2xl border border-slate-800 bg-gradient-to-br ${styles.gradient} hover:border-slate-700 transition-colors`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-slate-700 flex items-center justify-center mb-4 ${styles.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
