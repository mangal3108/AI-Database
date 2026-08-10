import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PostgreSQL AI Chatbot — Query Postgres in Plain English | Internite AI',
  description: 'Connect your PostgreSQL or Neon database and ask questions in natural language. Internite AI generates safe, read-only SQL and instant charts — no Postgres expertise required.',
  alternates: { canonical: 'https://internite.online/postgresql-ai' },
}

export default function PostgreSQLAIPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 antialiased font-sans">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3">PostgreSQL AI</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            AI chatbot for your<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PostgreSQL database.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Connect your Postgres database — including Supabase and Neon — and start asking questions in plain English. Internite indexes your full schema, understands table relationships, and generates safe read-only SQL instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/25">
              Connect PostgreSQL Free
            </Link>
            <Link href="/" className="inline-flex items-center justify-center text-slate-300 font-medium px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              See all databases
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { title: 'Works with any Postgres', desc: 'Self-hosted, Supabase, Neon, RDS, Cloud SQL, Railway — paste your connection string and go.' },
            { title: 'Full schema indexing', desc: 'Tables, columns, foreign keys, indexes, and data types are all mapped and embedded for semantic search.' },
            { title: 'Safe SQL generation', desc: 'Queries are validated against Postgres syntax and blocked from executing destructive statements.' },
            { title: 'Instant charts', desc: 'Revenue, user growth, funnel, cohort — Internite picks the right chart type automatically.' },
          ].map(f => (
            <div key={f.title} className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-2">{f.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/20 rounded-2xl p-10">
          <h2 className="text-2xl font-black text-white mb-3">Your Postgres database already has the answers.</h2>
          <p className="text-slate-300 mb-6">Connect in minutes. 100 free queries. No migration, no setup overhead.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all">
            Connect PostgreSQL
          </Link>
        </div>
      </div>
    </main>
  )
}
