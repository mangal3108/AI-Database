import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Database Chatbot — Talk to Any Database in Plain English | Internite AI',
  description: 'Internite AI is an AI-powered database chatbot. Connect PostgreSQL, MySQL, MongoDB, Supabase, and more. Ask questions in natural language and get instant SQL, answers, and charts.',
  alternates: { canonical: 'https://internite.online/database-chatbot' },
}

const FEATURES = [
  { title: 'Natural Language Queries', desc: 'Ask questions the way you think. Internite translates plain English into accurate, safe SQL automatically.' },
  { title: 'Multi-Database Support', desc: 'Connect PostgreSQL, MySQL, MongoDB, Supabase, Neon, and SQL Server from a single workspace.' },
  { title: 'Schema-Aware Intelligence', desc: 'Internite indexes your schema, understands relationships, and uses the right tables for every question.' },
  { title: 'Read-Only by Default', desc: 'All queries are validated before execution. Destructive operations are blocked at the engine level.' },
  { title: 'Instant Visualizations', desc: 'Every answer comes with the right chart automatically — bar, line, pie, or KPI card.' },
  { title: 'No Migration Required', desc: 'Connect your existing database in minutes. No data movement, no setup overhead.' },
]

export default function DatabaseChatbotPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 antialiased font-sans">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-3">AI Database Chatbot</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            Talk to any database<br />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">in plain English.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Internite AI is an AI-powered database chatbot that lets you ask questions about your data in natural language and get instant answers, SQL, and visualizations — without writing a single query.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/25">
              Start Free — No Credit Card
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 text-slate-300 font-medium px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              See all features
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-2">{f.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-10">
          <h2 className="text-2xl font-black text-white mb-3">Ready to talk to your database?</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Connect in minutes. 100 free AI queries included. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all">
            Start Free
          </Link>
        </div>
      </div>
    </main>
  )
}
