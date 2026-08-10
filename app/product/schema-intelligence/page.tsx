import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Database, Network, Cpu, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = generateSEO({
  title: 'Schema Intelligence — Internite AI',
  description: 'AI-powered database schema extraction, relationship mapping, and vector catalog indexing.',
  path: '/product/schema-intelligence',
})

export default function SchemaIntelligencePage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Product Feature
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Schema Intelligence & Mapping</h1>
          <p className="text-slate-400 text-lg mt-2">
            Automated schema discovery, foreign key resolution, and semantic metadata tagging across all databases.
          </p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
          <Database className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Automated Metadata Graph</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Understand complex schemas, joins, and table foreign key relationships without manual dictionary management.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            Explore Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  )
}
