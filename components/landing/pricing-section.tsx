'use client'

import { Check, Gift } from 'lucide-react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-24 px-4 bg-slate-50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Start for free. Scale as you grow.
          </h2>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 mb-4">Free</p>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-black text-slate-900">$0</span>
                <span className="text-sm text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">Perfect for side projects and individual developers.</p>
              
              <Link href="/signup" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-3 rounded-xl text-sm text-center transition-colors block mb-8">
                Get started for free
              </Link>

              <ul className="space-y-4 text-sm text-slate-600">
                {['1 Workspace', '1 Database Connection', '100 AI Queries / month', 'Basic Visualizations'].map(f => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={16} className="text-blue-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-blue-500 rounded-3xl p-8 flex flex-col relative shadow-xl shadow-blue-500/10"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              MOST POPULAR
            </div>
            <div>
              <p className="text-sm font-bold text-blue-600 mb-4">Pro</p>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-black text-slate-900">$29</span>
                <span className="text-sm text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">For professionals and small teams that need more power.</p>
              
              <Link href="/signup" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm text-center transition-colors block mb-8 shadow-sm">
                Start 14-day free trial
              </Link>

              <ul className="space-y-4 text-sm text-slate-600">
                {['Everything in Free, plus:', 'Unlimited Database Connections', '5,000 AI Queries / month', 'Advanced Custom Charts', 'Priority Email Support'].map((f, i) => (
                  <li key={f} className={`flex items-center gap-3 ${i === 0 ? 'font-bold text-slate-900 pb-2' : ''}`}>
                    {i > 0 && <Check size={16} className="text-blue-500 shrink-0" />}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 mb-4">Team</p>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-black text-slate-900">$79</span>
                <span className="text-sm text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">For growing teams that need collaboration features.</p>
              
              <Link href="/signup" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-3 rounded-xl text-sm text-center transition-colors block mb-8">
                Start 14-day free trial
              </Link>

              <ul className="space-y-4 text-sm text-slate-600">
                {['Everything in Pro, plus:', 'Up to 10 Team Members', 'Unlimited AI Queries', 'Shared Dashboards', 'API & Webhooks'].map((f, i) => (
                  <li key={f} className={`flex items-center gap-3 ${i === 0 ? 'font-bold text-slate-900 pb-2' : ''}`}>
                    {i > 0 && <Check size={16} className="text-blue-500 shrink-0" />}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Custom Plan / Enterprise Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center shrink-0">
              <Gift size={28} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Need a custom plan?</h3>
              <p className="text-sm text-slate-600">Contact us for custom limits, SLA, and enterprise features like SSO.</p>
            </div>
          </div>
          <Link href="/contact" className="shrink-0 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-sm">
            Contact Sales
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
