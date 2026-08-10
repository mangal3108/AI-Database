'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { PricingGlowBackground } from './backgrounds/PricingGlowBackground'

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 border-t border-slate-800/30 relative overflow-hidden">
      <PricingGlowBackground />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 font-mono">
          {'>'} PRICING
        </p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Simple, predictable pricing. <span className="text-[#60A5FA]">No hidden fees.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Start with our generous free tier or connect your own AI provider keys for unlimited queries at cost.
        </p>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Free Tier */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Free Tier</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Perfect for side projects & individual developers</p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>1 Workspace & 1 Database Connection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>100 Free AI Database Queries / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Basic Hybrid Schema RAG</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>5 Saved Queries & Export to CSV</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold py-3.5 rounded-2xl text-xs text-center border border-slate-700/50 transition-colors"
            >
              Get started free →
            </Link>
          </div>

          {/* Pro Tier */}
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
              <p className="text-xs text-slate-400 mt-2">For growing products, startups & active data teams</p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Unlimited Database Connections</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>5,000 AI Queries / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Advanced Schema Graph RAG</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Bring Your Own AI Key (BYO-Key)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Automated Dashboards & Charts</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-2xl text-xs text-center transition-colors shadow-lg shadow-emerald-500/20"
            >
              Start 14-day free trial →
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-purple-400 uppercase tracking-wider">Enterprise</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Dedicated infrastructure, SSO, and custom RBAC</p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Multi-Tenant Enterprise Workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>SAML SSO & Advanced RBAC Roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Immutable Audit Logs & SOC 2 Compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Dedicated VPC & On-Premises Proxy Support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold py-3.5 rounded-2xl text-xs text-center border border-slate-700/50 transition-colors"
            >
              Contact sales →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
