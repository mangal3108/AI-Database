'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { BarChart3, Check } from 'lucide-react'
import Link from 'next/link'

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const steps = [
    {
      number: '01', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30',
      label: 'Connect', headline: 'Connect your database',
      description: 'PostgreSQL, MySQL, MongoDB, Supabase, Neon — paste your connection string and you are ready.',
      type: 'terminal',
    },
    {
      number: '02', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30',
      label: 'Ask', headline: 'Ask in plain English',
      description: 'Type any question about your data. No SQL syntax, no schema memorisation required.',
      type: 'chat',
    },
    {
      number: '03', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30',
      label: 'Understand', headline: 'Internite finds the right data',
      description: 'Hybrid RAG identifies the exact tables and relationships needed to answer your question.',
      type: 'tables',
    },
    {
      number: '04', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',
      label: 'Visualize', headline: 'Get answers and charts instantly',
      description: 'Results appear with the right chart automatically. Add to a live dashboard in one click.',
      type: 'chart',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#06090F] relative overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <p className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            From database to insight{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">in seconds.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">No SQL expertise. No migration. No waiting for analysts. Just connect and ask.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className={`h-full bg-slate-900/60 border ${step.border} rounded-2xl p-5 backdrop-blur-sm hover:bg-slate-900/80 transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-mono font-black ${step.color} ${step.bg} border ${step.border} rounded-lg px-2 py-1`}>
                  {step.number}
                </span>
                <span className={`text-xs font-bold ${step.color} uppercase tracking-widest`}>{step.label}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{step.headline}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>

              {step.type === 'terminal' && (
                <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs space-y-1">
                  <div className="text-slate-400">$ internite connect postgres</div>
                  <div className="text-emerald-400">&#x2713; Connection established  184ms</div>
                  <div className="text-emerald-400">&#x2713; Schema indexed  84 tables</div>
                  <div className="text-emerald-400">&#x2713; Relationships discovered  213</div>
                </div>
              )}
              {step.type === 'chat' && (
                <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3">
                  <div className="text-[10px] font-mono text-slate-500 mb-2">AI Chat</div>
                  <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl rounded-tl-none px-3 py-2 text-xs text-slate-200">
                    Show monthly revenue for the last 12 months
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Analysing schema...
                  </div>
                </div>
              )}
              {step.type === 'tables' && (
                <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs space-y-1.5">
                  <div className="text-slate-500 text-[10px] mb-2">Schema Intelligence</div>
                  {['orders', 'payments', 'customers'].map(t => (
                    <div key={t} className="flex items-center gap-2 text-slate-300">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                  <div className="mt-2 text-slate-600 text-[10px] border-t border-slate-800 pt-2">
                    &#x2713; Query validated &middot; Read-only confirmed
                  </div>
                </div>
              )}
              {step.type === 'chart' && (
                <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3">
                  <div className="text-[10px] font-mono text-slate-500 mb-1">Monthly Revenue</div>
                  <div className="text-lg font-black text-white">&#x20B9;18.42L</div>
                  <div className="mt-2 flex items-end gap-0.5 h-10">
                    {[40,55,45,70,60,85,75,90,80,95,88,100].map((h, ci) => (
                      <div key={ci} className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400 opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <button className="mt-2 text-[9px] font-bold text-indigo-300 bg-indigo-600/20 border border-indigo-500/30 rounded-lg px-2 py-1">
                    Add to Dashboard &rarr;
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:scale-105">
            Start Free &mdash; No Credit Card
          </Link>
          <Link href="#demo" className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
            <BarChart3 size={16} className="text-cyan-400" />
            See It In Action
          </Link>
        </motion.div>
      </div>
    </section>
  )
}