import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Zap, Layers, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = generateSEO({
  title: 'Hybrid RAG Architecture — Internite AI',
  description: 'Retrieval Augmented Generation for enterprise database schemas and context-grounded AI queries.',
  path: '/product/rag',
})

export default function RagProductPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Architecture
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Hybrid Vector & SQL RAG</h1>
          <p className="text-slate-400 text-lg mt-2">
            Zero hallucination database context indexing using dense vector retrieval and structured schema pruning.
          </p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
          <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Schema Grounded LLM Context</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Combines vector index search over documentation and strict relational schema filtering for 100% accurate SQL.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  )
}
