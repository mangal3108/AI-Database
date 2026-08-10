'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Lock, Eye, ShieldCheck, Server, ScrollText, Key } from 'lucide-react'
import { SectionBackground } from './section-background'

const SECURITY_POINTS = [
  {
    icon: Lock,
    title: 'Encrypted at rest',
    description: 'All database credentials are encrypted using AES-256-GCM before storage. The encryption key lives server-side only.',
  },
  {
    icon: Eye,
    title: 'Credentials never reach your browser',
    description: 'Database passwords and connection strings are never sent to the frontend — not even masked. All queries run server-side.',
  },
  {
    icon: ShieldCheck,
    title: 'Read-only by default',
    description: 'The AI query engine blocks DROP, DELETE, UPDATE, INSERT, TRUNCATE, ALTER, and GRANT by default. Write mode requires explicit opt-in.',
  },
  {
    icon: Server,
    title: 'Tenant isolation',
    description: 'Every query, conversation, and schema is scoped to your organization. Database connections cannot be accessed across tenants.',
  },
  {
    icon: ScrollText,
    title: 'Audit logging',
    description: 'Every query is logged with user, timestamp, database, and SQL. Export logs for compliance and debugging.',
  },
  {
    icon: Key,
    title: 'API key management',
    description: 'Granular API keys with IP allowlisting, expiration, and per-key rate limits. Rotate keys without downtime.',
  },
]

export function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="security" className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background with green tint */}
      <SectionBackground theme="green" opacity={0.6} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} SECURITY
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your data stays yours.
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Internite AI is built with a security-first architecture.
            We treat your database credentials like nuclear launch codes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 hover:border-emerald-500/20 transition-colors"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <point.icon size={18} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
