'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { SectionBackground } from './section-background'

const EXAMPLE_QUESTIONS = [
  { category: 'Revenue', question: 'What was our monthly revenue for the last 12 months?' },
  { category: 'Customers', question: 'Show me the top 10 customers by order volume' },
  { category: 'Products', question: 'Which products are losing revenue this quarter?' },
  { category: 'Trends', question: 'How has our conversion rate changed over time?' },
  { category: 'Inventory', question: 'What items are running low on stock?' },
  { category: 'Users', question: 'Which users haven\'t logged in recently?' },
  { category: 'Performance', question: 'What are our slowest API endpoints?' },
  { category: 'Cohort', question: 'Show me user retention by signup month' },
]

export function WhatYouCanAsk() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="py-20 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background */}
      <SectionBackground theme="minimal" opacity={0.6} />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} ASK_ANYTHING
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ask your data anything
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            No SQL knowledge required. Just ask in plain English and get instant answers from your database.
          </p>
        </motion.div>

        {/* Example Questions Grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {EXAMPLE_QUESTIONS.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                <Search className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-medium text-emerald-400/70 uppercase tracking-wider">
                  {item.category}
                </span>
                <p className="text-sm text-slate-300 mt-1 group-hover:text-white transition-colors">
                  &ldquo;{item.question}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Start asking your data
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
