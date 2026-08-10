import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Code, Terminal, Package, ArrowRight } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'TypeScript SDK — Internite AI',
  description: 'Official TypeScript and JavaScript SDK for Internite AI. Fully typed client library for querying database clusters with AI.',
  path: '/developers/sdk',
})

export default function SdkDocsPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Developer Documentation
          </span>
          <h1 className="text-4xl font-black text-white mt-3">TypeScript & JS SDK</h1>
          <p className="text-slate-400 text-lg mt-2">
            Fully typed, lightweight client library for querying database clusters with natural language AI.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Package className="text-indigo-400" size={20} />
            Installation
          </h2>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-300">
            npm install @interniteai/sdk
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
