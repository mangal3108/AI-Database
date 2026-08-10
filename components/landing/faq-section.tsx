'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionBackground } from './section-background'

const FAQS = [
  {
    q: 'Is my database password safe?',
    a: 'Yes. Credentials are encrypted with AES-256-GCM before storage. The encryption key is server-side only and is never sent to the browser, logged, or included in AI prompts. Internite AI never stores passwords in plaintext, and connection strings are not visible in API responses. Connections are established server-side with TLS 1.3. You can revoke access at any time by removing the connection from your workspace.',
  },
  {
    q: 'Can the AI accidentally delete or modify my data?',
    a: 'No. By default, Internite AI operates in strict read-only mode. The query safety engine parses every generated SQL statement with an AST validator and blocks DROP, DELETE, UPDATE, INSERT, TRUNCATE, ALTER, GRANT, REVOKE, and other destructive or privilege-changing operations before they reach your database. Write access requires explicit administrator opt-in at the workspace level and is logged with full audit trails.',
  },
  {
    q: 'What databases does Internite AI support?',
    a: 'PostgreSQL, MySQL, MongoDB, and SQL Server are fully supported with production-grade connection handling, schema indexing, and SQL dialect awareness. Supabase and Neon (PostgreSQL-compatible) work out of the box. We are actively adding support for SQLite, Oracle, BigQuery, ClickHouse, and CockroachDB. Each connector is tested against real production schemas, not toy examples.',
  },
  {
    q: 'How does the AI understand my database schema?',
    a: 'When you connect a database, Internite introspects your full schema: tables, columns, data types, indexes, foreign keys, and relationships. This metadata is embedded using semantic vector representations and stored in a private schema graph. When you ask a question, a Hybrid RAG retrieval step scores and selects only the most relevant tables for the AI context window — which also reduces token usage and improves accuracy. The schema is re-indexed automatically when your schema changes.',
  },
  {
    q: 'Can I use my own OpenAI or Anthropic API key?',
    a: 'Yes. Pro and Enterprise plans support Bring Your Own Key (BYOK). You can configure your OpenAI, Anthropic, or Gemini API key in workspace settings. Your key is encrypted at rest with AES-256-GCM and is used only during query generation. Using BYOK means Internite does not consume platform AI quota for your queries, giving you full cost control and model version flexibility.',
  },
  {
    q: 'How accurate are the generated SQL queries?',
    a: 'Accuracy depends on the complexity of the question and the clarity of your schema naming. On well-structured databases with clear table and column names, Internite achieves over 95% query accuracy for standard analytical questions. For complex multi-join or window function queries, the AI explains its reasoning and shows the generated SQL so you can validate and refine it. We continuously improve the model based on anonymized accuracy feedback.',
  },
  {
    q: 'What happens if I exceed my monthly query quota?',
    a: 'On the Free tier, queries are paused when the 100-query monthly limit is reached. You can upgrade to Pro at any time to continue immediately. On Pro, if you exceed 5,000 queries, you can either upgrade to Enterprise, bring your own AI key for additional usage at cost, or wait for the next billing cycle. We never drop queries silently — you always receive a clear notification when approaching limits.',
  },
  {
    q: 'Is Internite SOC 2 compliant?',
    a: 'We are building toward SOC 2 compliance and follow its security principles in our architecture: tenant isolation, encrypted credential storage, audit logging, and access controls. We do not yet hold a formal SOC 2 Type II certification. Enterprise customers interested in our compliance roadmap and timeline can contact us at security@internite.online.',
  },
]

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SectionBackground theme="blue" opacity={0.5} />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 font-mono">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-slate-400 mt-3 text-sm max-w-lg mx-auto">
            Can not find your answer?{' '}
            <a href="mailto:hello@internite.online" className="text-cyan-400 hover:underline">Email us directly.</a>
          </p>
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
                aria-expanded={openIndex === i}
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
                    <div className="px-4 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
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
