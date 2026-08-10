'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Code2, TrendingUp, BarChart3, Package, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const PERSONAS = [
  {
    id: 'developers',
    icon: Code2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    activeBorder: 'border-blue-400',
    label: 'Developers',
    headline: 'Generate SQL without writing every query.',
    points: ['Skip repetitive exploratory queries','Debug schema relationships instantly','API access to query results','BYO AI key for unlimited use'],
    cta: 'View API docs',
    href: '/developers/api',
  },
  {
    id: 'founders',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    activeBorder: 'border-emerald-400',
    label: 'Founders',
    headline: 'Answer business questions without waiting for analysts.',
    points: ['MRR, churn, and growth metrics on demand','No SQL or data team required','Instant charts for investor updates','Connect Supabase, Neon, or any DB'],
    cta: 'Start free',
    href: '/signup',
  },
  {
    id: 'data-teams',
    icon: BarChart3,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    activeBorder: 'border-purple-400',
    label: 'Data Teams',
    headline: 'Explore databases faster and build dashboards automatically.',
    points: ['Hybrid RAG understands your schema context','Auto-generate dashboards from questions','Save and share query results as charts','Multi-database in one workspace'],
    cta: 'See all features',
    href: '#features',
  },
  {
    id: 'product',
    icon: Package,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    activeBorder: 'border-orange-400',
    label: 'Product Teams',
    headline: 'Understand customers and product behaviour instantly.',
    points: ['User retention, funnel, and cohort analysis','Ask questions in natural language','Share live dashboard links with stakeholders','Zero data migration required'],
    cta: 'Try for free',
    href: '/signup',
  },
  {
    id: 'agencies',
    icon: Users,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    activeBorder: 'border-pink-400',
    label: 'Agencies',
    headline: 'Connect multiple client databases from one workspace.',
    points: ['Multi-tenant workspace isolation','Per-client database connections','White-label dashboard sharing','Enterprise RBAC and audit logs'],
    cta: 'Talk to sales',
    href: '/contact',
  },
]

export function WhoIsThisFor() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState('founders')
  const persona = PERSONAS.find(p => p.id === active)!

  return (
    <section id="who-is-this-for" className="py-24 px-6 bg-[#050507] relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-3">Built For</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Everyone who needs answers{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              from data.
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Whether you write SQL daily or have never opened a database terminal, Internite works for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {PERSONAS.map(p => {
            const isActive = active === p.id
            const tabClass = isActive
              ? `${p.activeBorder} ${p.bg} ${p.color}`
              : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${tabClass}`}
              >
                <p.icon size={14} />
                {p.label}
              </button>
            )
          })}
        </motion.div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`bg-slate-900/60 border ${persona.border} rounded-2xl p-8 backdrop-blur-sm`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 ${persona.bg} border ${persona.border} rounded-xl px-3 py-1.5 mb-4`}>
                <persona.icon size={16} className={persona.color} />
                <span className={`text-xs font-bold ${persona.color} uppercase tracking-wider`}>{persona.label}</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 leading-tight">{persona.headline}</h3>
              <ul className="space-y-3">
                {persona.points.map(point => {
                  const dotBg = persona.color.replace('text-', 'bg-')
                  return (
                    <li key={point} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className={`mt-0.5 w-4 h-4 rounded-full ${persona.bg} border ${persona.border} flex items-center justify-center shrink-0`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
                      </span>
                      {point}
                    </li>
                  )
                })}
              </ul>
              <Link
                href={persona.href}
                className={`mt-6 inline-flex items-center gap-2 ${persona.color} font-bold text-sm hover:opacity-80 transition-opacity`}
              >
                {persona.cta}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="hidden md:block">
              <div className={`rounded-2xl border ${persona.border} bg-gradient-to-br from-slate-950 to-slate-900 p-6`}>
                <div className={`text-xs font-mono font-bold ${persona.color} uppercase tracking-widest mb-4`}>
                  {persona.label} Impact
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Time saved per week', value: '8+ hours', width: '80%' },
                    { label: 'Queries answered instantly', value: '95%', width: '95%' },
                    { label: 'Setup time', value: '< 5 min', width: '15%' },
                  ].map(stat => {
                    const barBg = persona.color.replace('text-', 'bg-')
                    return (
                      <div key={stat.label}>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{stat.label}</span>
                          <span className="font-bold text-white">{stat.value}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barBg} opacity-70`} style={{ width: stat.width }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className={`mt-6 p-4 rounded-xl ${persona.bg} border ${persona.border}`}>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;Connected our production Postgres in 3 minutes and immediately started getting answers we used to wait 2 days for.&rdquo;
                  </p>
                  <p className={`mt-2 text-xs font-bold ${persona.color}`}>— Beta user, SaaS {persona.label}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
