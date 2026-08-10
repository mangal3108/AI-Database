'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link2, Search, Cpu, Play, BarChart3, MessageSquare } from 'lucide-react'

const STEPS = [
  {
    icon: Link2,
    step: '01',
    title: 'Connect your database',
    description: 'Paste a connection string or fill in credentials. We test, introspect, and encrypt everything instantly.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Schema is automatically understood',
    description: 'Internite AI maps every table, column, relationship, and business meaning — without any configuration.',
  },
  {
    icon: Cpu,
    step: '03',
    title: 'RAG indexes your knowledge',
    description: 'Schema, table descriptions, and sample patterns are embedded into a vector knowledge base.',
  },
  {
    icon: MessageSquare,
    step: '04',
    title: 'Ask in plain English',
    description: '"Show me top customers by revenue this month." Internite AI understands intent, retrieves context.',
  },
  {
    icon: Play,
    step: '05',
    title: 'Safe query generated and executed',
    description: 'SQL is generated, validated, and executed — all server-side. Your credentials never touch the browser.',
  },
  {
    icon: BarChart3,
    step: '06',
    title: 'Answer, table, and chart',
    description: 'Results appear with a natural-language explanation, a sortable table, and an auto-selected visualization.',
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="section-padding bg-muted/20 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-block text-sm text-primary font-medium uppercase tracking-widest mb-4">
            How it works
          </div>
          <h2 className="heading-xl text-foreground mb-4">
            From connection
            <br />
            to insight in minutes.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon size={18} className="text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
