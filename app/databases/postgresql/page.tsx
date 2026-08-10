import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEO } from '@/lib/seo'
import { MarketingLayout } from '@/components/marketing/layout/marketing-layout'
import { Database, Shield, BarChart3, Code, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: 'AI Chatbot for PostgreSQL — Ask PostgreSQL Questions in Natural Language',
  description: 'Connect your PostgreSQL database and ask questions in plain English. Internite AI generates safe SQL, understands your schema, and creates visualizations automatically.',
  path: '/databases/postgresql',
  keywords: ['AI PostgreSQL chatbot', 'chat with PostgreSQL', 'PostgreSQL AI assistant', 'natural language PostgreSQL', 'PostgreSQL visualization'],
})

const EXAMPLE_QUESTIONS = [
  { question: 'Show monthly revenue for the last 12 months', category: 'Revenue' },
  { question: 'Which customers have the highest lifetime value?', category: 'Customers' },
  { question: 'What is our average order value by region?', category: 'Orders' },
  { question: 'Show user signups trend over time', category: 'Users' },
  { question: 'Which products have the lowest stock levels?', category: 'Inventory' },
  { question: 'Compare conversion rates by traffic source', category: 'Analytics' },
]

const FEATURES = [
  {
    icon: Code,
    title: 'Full PostgreSQL Support',
    description: 'Complete support for PostgreSQL syntax including window functions, CTEs, JSON operations, array functions, and advanced SQL patterns.',
  },
  {
    icon: Shield,
    title: 'Safe Query Execution',
    description: 'All queries are validated before execution. Destructive operations are blocked, and queries are optimized for performance.',
  },
  {
    icon: BarChart3,
    title: 'Automatic Visualization',
    description: 'Results are automatically visualized as charts, tables, or KPIs based on data types and query patterns.',
  },
  {
    icon: Zap,
    title: 'Schema Intelligence',
    description: 'AI understands PostgreSQL-specific features including PostGIS, hstore, jsonb columns, and custom types.',
  },
]

export default function PostgreSQLPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 to-[#050505]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <span className="text-2xl">🐘</span>
            <span className="text-sm font-medium text-emerald-400">PostgreSQL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ask your PostgreSQL database<br />
            <span className="text-emerald-400">anything in plain English</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Connect your PostgreSQL database in seconds. Ask questions like &ldquo;Which customers generated the most revenue this quarter?&rdquo; and get instant answers with visualizations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/product/database-chat"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-slate-700"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Built for PostgreSQL
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">
            Native understanding of PostgreSQL features, syntax, and best practices.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Questions */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Example Questions
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Try these or ask your own questions in natural language.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {EXAMPLE_QUESTIONS.map((item, index) => (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition-colors cursor-pointer group"
              >
                <span className="text-xs font-medium text-emerald-400 mb-2 block">{item.category}</span>
                <p className="text-white group-hover:text-emerald-400 transition-colors">&ldquo;{item.question}&rdquo;</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Connect your PostgreSQL database
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#050505] to-emerald-950/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to talk to your PostgreSQL data?
          </h2>
          <p className="text-slate-400 mb-8">
            Connect your database in minutes. No SQL knowledge required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25"
          >
            Start Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  )
}
