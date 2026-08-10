import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Webhook, Radio, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Webhooks Documentation — Internite AI',
  description: 'Subscribe to real-time database query, RAG index, and subscription event webhooks with Internite AI.',
  path: '/developers/webhooks',
})

export default function WebhooksDocsPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Developer Documentation
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Event Webhooks</h1>
          <p className="text-slate-400 text-lg mt-2">
            Receive automated real-time HTTP POST notifications when queries run, RAG documents complete, or subscriptions update.
          </p>
        </div>
      </div>
    </MarketingLayout>
  )
}
