'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Users, Lock, Activity, CreditCard, Key, Globe, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { SectionBackground } from './section-background'

const ENTERPRISE_FEATURES = [
  { icon: Shield, title: 'Organization Isolation', description: 'Every database, query, and conversation is scoped to your organization.' },
  { icon: Users, title: 'Team Management', description: 'Invite team members, set roles, manage permissions across your organization.' },
  { icon: Lock, title: 'Role-Based Access', description: 'Define custom roles with specific permissions for different team members.' },
  { icon: Activity, title: 'Audit Logging', description: 'Track every query, user action, and system event with full audit trail.' },
  { icon: CreditCard, title: 'Usage Controls', description: 'Set query limits, monitor usage, and manage billing at the organization level.' },
  { icon: Key, title: 'API Access', description: 'Programmatic access with API keys, scoped permissions, and webhook events.' },
]

export function EnterpriseSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Minimal Background with warm tint */}
      <SectionBackground theme="warm" opacity={0.6} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 font-mono">
            {'>'} ENTERPRISE
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for scale
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Multi-tenant architecture, enterprise SSO, and advanced security controls for large organizations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENTERPRISE_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl hover:border-purple-500/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <feature.icon size={16} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact sales
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
