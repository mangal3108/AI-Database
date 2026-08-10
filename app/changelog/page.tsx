import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { GitBranch, Clock, Check } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Changelog — Internite AI',
  description: 'Latest feature releases, product updates, and API enhancements for Internite AI.',
  path: '/changelog',
})

export default function ChangelogPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Release Notes
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Product Changelog</h1>
          <p className="text-slate-400 text-lg mt-2">
            New features, enhancements, and performance updates added to Internite AI.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">v1.2.0</span>
              <span className="text-xs text-slate-500 font-mono">August 2026</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Multi-Tenant SaaS Billing & Razorpay Integration</h2>
            <p className="text-xs text-slate-400 mb-4">
              Added complete multi-tenant organization subscription billing, API key provisioning, webhooks, and entitlement engine.
            </p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
