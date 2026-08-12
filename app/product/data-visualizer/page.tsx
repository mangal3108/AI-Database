import { Metadata } from 'next'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = generateSEO({
  title: 'Data Visualizer — Internite AI',
  description: 'Automatically transform database query results into interactive charts, graphs, and executive dashboards.',
  path: '/product/data-visualizer',
})

export default function DataVisualizerPage() {
  return (
    <MarketingLayout>
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-md uppercase tracking-wider">
            Product Feature
          </span>
          <h1 className="text-4xl font-black text-white mt-3">Interactive Data Visualizer</h1>
          <p className="text-slate-400 text-lg mt-2">
            Instantly turn SQL outputs into bar charts, line graphs, KPI cards, and custom dashboards.
          </p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
          <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Automated Chart Selection</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Internite reads the shape of your query results and helps you choose a useful visualization quickly.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            Try In Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  )
}
