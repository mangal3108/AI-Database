'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PricingGlowBackground } from './backgrounds/PricingGlowBackground'

const PLAN_PERSONAS = [
  { label: 'Exploring / side project', plan: 'free' },
  { label: 'Startup / small team', plan: 'pro' },
  { label: 'Data or product team', plan: 'pro' },
  { label: 'Enterprise / agency', plan: 'enterprise' },
]

export function PricingSection() {
  const [analysts, setAnalysts] = useState(3)
  const [queriesPerWeek, setQueriesPerWeek] = useState(40)
  const [minsPerQuery, setMinsPerQuery] = useState(30)

  const hoursSavedPerMonth = Math.round((analysts * queriesPerWeek * minsPerQuery) / 60 * 4)

  return (
    <section id="pricing" className="py-24 border-t border-slate-800/30 relative overflow-hidden">
      <PricingGlowBackground />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 font-mono">Pricing</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple, predictable pricing. <span className="text-[#60A5FA]">No hidden fees.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
            Start with the generous free tier or bring your own AI key for unlimited queries at cost.
          </p>
        </div>

        {/* Which plan? selector */}
        <div className="mb-14 max-w-3xl mx-auto">
          <p className="text-center text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">Which Internite are you?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLAN_PERSONAS.map(p => (
              <div key={p.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-300 mb-1.5">{p.label}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  p.plan === 'free' ? 'bg-slate-700 text-slate-300' :
                  p.plan === 'pro' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {p.plan === 'free' ? 'Free' : p.plan === 'pro' ? 'Pro' : 'Enterprise'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16">
          {/* Free */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Free Tier</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Perfect for side projects and individual developers</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                {['1 Workspace & 1 Database Connection','100 Free AI Queries / month','Basic Hybrid Schema RAG','5 Saved Queries & Export to CSV'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signup" className="mt-8 w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold py-3.5 rounded-2xl text-xs text-center border border-slate-700/50 transition-colors block">
              Get started free →
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-slate-900/60 backdrop-blur-sm border-2 border-emerald-500/50 rounded-3xl p-8 flex flex-col justify-between relative shadow-xl shadow-emerald-500/5">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              MOST POPULAR
            </span>
            <div>
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Pro Developer</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$29</span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Stop waiting for your data team.</p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                {[
                  'Unlimited Database Connections',
                  '5,000 AI questions / month',
                  'Advanced Schema Graph RAG',
                  'Bring Your Own AI Key (BYO-Key)',
                  'Automated Dashboards & Charts',
                  'API access & webhooks',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signup" className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-2xl text-xs text-center transition-colors shadow-lg shadow-emerald-500/20 block">
              Start 14-day free trial →
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-purple-400 uppercase tracking-wider">Enterprise</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Dedicated infrastructure, SSO, and custom RBAC</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                {[
                  'Multi-Tenant Enterprise Workspaces',
                  'SAML SSO & Advanced RBAC Roles',
                  'Immutable Audit Logs & SOC 2 Readiness Roadmap',
                  'Dedicated VPC & On-Premises Proxy Support',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/contact" className="mt-8 w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold py-3.5 rounded-2xl text-xs text-center border border-slate-700/50 transition-colors block">
              Contact sales →
            </Link>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
          <p className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-2">ROI Estimate</p>
          <h3 className="text-xl font-black text-white mb-1">How much analyst time could you save?</h3>
          <p className="text-xs text-slate-400 mb-6">These are estimates to help you think through the value. Your actual results will vary.</p>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Analysts / team members answering data questions</span>
                <span className="font-bold text-white">{analysts}</span>
              </div>
              <input type="range" min={1} max={20} value={analysts} onChange={e => setAnalysts(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Data questions per person per week</span>
                <span className="font-bold text-white">{queriesPerWeek}</span>
              </div>
              <input type="range" min={5} max={200} step={5} value={queriesPerWeek} onChange={e => setQueriesPerWeek(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 rounded-full" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Average minutes to answer each question manually</span>
                <span className="font-bold text-white">{minsPerQuery} min</span>
              </div>
              <input type="range" min={5} max={120} step={5} value={minsPerQuery} onChange={e => setMinsPerQuery(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 rounded-full" />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-black text-white">~{hoursSavedPerMonth} hours</div>
              <div className="text-xs text-slate-400">estimated saved per month</div>
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shrink-0">
              Start Free
            </Link>
          </div>
          <p className="mt-3 text-[10px] text-slate-600 text-center">Pro is $29/month. At {analysts} analyst{analysts !== 1 ? 's' : ''} and {queriesPerWeek} questions/week, the tool pays for itself in saved time.</p>
        </div>
      </div>
    </section>
  )
}
