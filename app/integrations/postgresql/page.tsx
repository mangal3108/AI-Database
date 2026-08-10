import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Database, Shield, Zap, BarChart3, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Chatbot for PostgreSQL | Natural Language PostgreSQL Queries',
  description: 'Ask your PostgreSQL database questions in plain English. Connect PostgreSQL, Neon, Supabase, or any Postgres database to Internite AI and get instant answers, charts, and insights.',
  keywords: ['PostgreSQL AI chatbot', 'chat with PostgreSQL', 'natural language SQL', 'PostgreSQL query AI', 'Postgres AI assistant'],
  openGraph: {
    title: 'AI Chatbot for PostgreSQL | Internite AI',
    description: 'Ask your PostgreSQL database questions in plain English. Get instant SQL-backed answers with visualizations.',
    type: 'website',
  },
}

const FEATURES = [
  { icon: MessageSquare, title: 'Natural Language Queries', description: 'Ask questions like "Show top customers by revenue" — Internite AI generates the SQL.' },
  { icon: Database, title: 'Full Schema Understanding', description: 'Automatically discovers tables, columns, relationships, and indexes in your PostgreSQL database.' },
  { icon: Shield, title: 'Read-Only Security', description: 'DROP, DELETE, UPDATE blocked by default. Credentials encrypted with AES-256-GCM.' },
  { icon: BarChart3, title: 'Automatic Visualization', description: 'Query results turned into charts, graphs, and dashboards automatically.' },
  { icon: Zap, title: 'Streaming Results', description: 'Watch queries execute in real-time. See SQL generation and results as they appear.' },
]

const QUERIES = [
  '"Show me monthly revenue for the last 12 months"',
  '"What are the top 10 customers by order volume?"',
  '"Which products have the highest return rate?"',
  '"What is our user retention by signup cohort?"',
  '"Show me revenue by region and product category"',
]

export default function PostgreSQLPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl">
            <span className="text-white">INTERN</span>
            <span className="text-[#60A5FA]">ITE</span>
          </Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm">
            Start Free →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Database Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#336791]/20 border border-[#336791]/40 mb-6">
            <div className="w-6 h-6 rounded bg-[#336791] flex items-center justify-center text-white text-xs font-bold">PG</div>
            <span className="text-sm font-semibold text-white">PostgreSQL Integration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ask your PostgreSQL database<br />
            <span className="text-[#336791]">questions in plain English</span>
          </h1>
          <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto">
            Connect PostgreSQL, Neon, Supabase, RDS, Railway, or any Postgres-compatible database. Ask questions in natural language. Get accurate SQL-backed answers with automatic visualizations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all">
              Connect PostgreSQL Free →
            </Link>
            <Link href="/#demo" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-2xl text-sm">
              See it in action →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-[#080B10]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Everything you need to query PostgreSQL with AI
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6">
                <f.icon className="w-10 h-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Queries */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Example questions you can ask
          </h2>
          <p className="text-slate-400 mb-10">
            Internite AI understands PostgreSQL-specific syntax and functions
          </p>
          <div className="grid gap-4 text-left">
            {QUERIES.map((q) => (
              <div key={q} className="bg-[#0D111A] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                <code className="text-sm text-slate-300">{q}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PostgreSQL Specifics */}
      <section className="py-16 px-4 bg-[#080B10]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            PostgreSQL features we support
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'PostgreSQL 12, 13, 14, 15, 16',
              'Postgres arrays and JSONB',
              'Window functions (ROW_NUMBER, RANK)',
              'Common Table Expressions (CTE)',
              'PostGIS geospatial queries',
              'Full-text search (tsvector)',
              'UUID and JSON data types',
              'pg_trgm fuzzy matching',
              'COPY and bulk operations',
              'Materialized views',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-slate-300">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to query PostgreSQL with AI?
          </h2>
          <p className="text-slate-400 mb-8">
            Connect your database in under 2 minutes. No credit card required.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-2xl text-sm">
            Start free with PostgreSQL
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center text-sm text-slate-500">
        <p>© 2026 Internite AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
