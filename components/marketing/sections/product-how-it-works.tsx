'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Step {
  step: number
  title: string
  description: string
  code?: string | null
}

interface ProductHowItWorksProps {
  title?: string
  subtitle?: string
  steps: Step[]
  theme?: 'blue' | 'purple' | 'green' | 'cyan'
}

export function ProductHowItWorks({ title = 'How it works', subtitle, steps, theme = 'blue' }: ProductHowItWorksProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const accentColors: Record<string, string> = {
    blue: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-emerald-400',
    cyan: 'text-cyan-400',
  }

  const lineColors: Record<string, string> = {
    blue: 'bg-cyan-500/30',
    purple: 'bg-purple-500/30',
    green: 'bg-emerald-500/30',
    cyan: 'bg-cyan-500/30',
  }

  return (
    <section className="py-24 px-6 bg-slate-900/50" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-6 top-0 bottom-0 w-px ${lineColors[theme]}`} />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Number circle */}
                <div className={`absolute left-0 w-12 h-12 rounded-full bg-slate-800 border-2 ${lineColors[theme].replace('bg-', 'border-')} flex items-center justify-center`}>
                  <span className={`font-mono text-sm font-bold ${accentColors[theme]}`}>{step.step}</span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
