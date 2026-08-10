'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Clock, X, Check, ArrowDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const WITHOUT_STEPS = [
  { text: 'Business question', warning: false },
  { text: 'Ask analyst or developer', warning: false },
  { text: 'Wait hours or days', warning: true },
  { text: 'Receive SQL query', warning: false },
  { text: 'Build dashboard', warning: false },
  { text: 'Finally: get your answer', warning: false },
]

const WITH_STEPS = [
  { text: 'Business question', highlight: false },
  { text: 'Ask Internite AI', highlight: false },
  { text: 'Answer + Chart instantly', highlight: true },
]

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-6 bg-[#070A12] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Stop waiting for SQL.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every team needs data. But turning questions into answers requires technical skills, bottlenecks, and hours nobody has.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <X size={14} className="text-red-400" />
              </div>
              <span className="text-sm font-bold text-red-400 uppercase tracking-wider font-mono">Without Internite</span>
            </div>
            <div className="space-y-2">
              {WITHOUT_STEPS.map((step, i) => (
                <div key={i}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${step.warning ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'text-slate-400'}`}>
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-600 shrink-0">
                      {i + 1}
                    </span>
                    {step.text}
                    {step.warning && <Clock size={12} className="ml-auto text-red-400 shrink-0" />}
                  </div>
                  {i < WITHOUT_STEPS.length - 1 && (
                    <div className="flex justify-center my-1"><ArrowDown size={12} className="text-slate-700" /></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2">
              <Clock size={14} className="text-red-400" />
              <span className="text-xs font-bold text-red-400">Hours or days</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-2xl" />
            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Check size={14} className="text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono">With Internite</span>
            </div>
            <div className="space-y-2 relative z-10">
              {WITH_STEPS.map((step, i) => (
                <div key={i}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${step.highlight ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 ${step.highlight ? 'border-emerald-500/50 text-emerald-400' : 'border-slate-600 text-slate-500'}`}>
                      {i + 1}
                    </span>
                    {step.text}
                    {step.highlight && <Check size={12} className="ml-auto text-emerald-400 shrink-0" />}
                  </div>
                  {i < WITH_STEPS.length - 1 && (
                    <div className="flex justify-center my-1"><ArrowDown size={12} className="text-emerald-700" /></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 relative z-10">
              <div className="flex items-end gap-0.5 h-8 mb-1">
                {[40,55,45,70,60,85,75,90,80,95,88,100].map((h, ci) => (
                  <div key={ci} className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400 opacity-70" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-[10px] font-mono text-emerald-400">Revenue chart generated automatically</div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 relative z-10">
              <Check size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Seconds</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-105">
            Get answers in seconds
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
