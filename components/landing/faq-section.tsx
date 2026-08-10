'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionBackground } from './section-background'

const FAQS = [
  {
    q: 'Is my database password safe?',
    a: 'Yes. Credentials are encrypted with AES-256-GCM before storage. The encryption key is server-side only and never sent to the browser. Internite AI never logs passwords, connection strings, or API keys.',
  },
  {
    q: 'Can the AI accidentally delete or modify my data?',
    a: 'No. By default, Internite AI operates in read-only mode. The query safety engine blocks DROP, DELETE, UPDATE, INSERT, TRUNCATE, ALTER, GRANT, and other destructive operations before execution. Write access requires explicit administrator opt-in.',
  },
  {
    q: 'What databases does Internite AI support?',
    a: 'PostgreSQL, MySQL, MongoDB, and SQL Server are fully supported. We are actively working on adding support for more databases including SQLite, Oracle, and BigQuery.',
  },
  {
    q: 'How does the AI understand my database schema?',
    a: 'Internite AI analyzes your database schema on connection, including table structures, relationships, and data types. This schema knowledge is used to generate accurate SQL queries that match your actual database.',
  },
  {
    q: 'Can I use my own OpenAI/Anthropic API key?',
    a: 'Yes. Pro and Enterprise plans support Bring Your Own Key (BYOK). Use your own API keys for full control over costs and data processing. Your keys are encrypted and stored securely.',
  },
  {
    q: 'How accurate are the generated SQL queries?',
    a: 'Our AI achieves 95%+ query accuracy on standard database operations. The accuracy depends on query complexity and schema clarity. We continuously improve the model based on user feedback.',
  },
]

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background with blue tint */}
      <SectionBackground theme="blue" opacity={0.5} />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
