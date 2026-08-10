import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { BookOpen, FileText, Zap } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'Documentation — Internite AI',
  description: 'Comprehensive guides, API reference, and quickstart tutorials for Internite AI.',
  path: '/developers/docs',
})

export default function GeneralDocsPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Developer Documentation
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Internite AI Docs</h1>
          <p className="text-slate-400 text-lg mt-2">
            Everything you need to connect databases, build AI assistants, and embed natural language data analytics into your software.
          </p>
        </div>
      </div>
    </MarketingLayout>
  )
}
