import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MySQL AI Chatbot — Query MySQL in Plain English | Internite AI',
  description: 'Connect your MySQL database and ask questions in natural language. Internite AI generates safe, read-only MySQL queries and instant visualizations — no SQL expertise required.',
  alternates: { canonical: 'https://internite.online/mysql-ai' },
}

export default function MySQLAIPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-slate-100 antialiased font-sans">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-3">MySQL AI</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            AI chatbot for your<br />
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">MySQL database.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Connect your MySQL database and ask any question in plain English. Internite AI indexes your full schema, understands table relationships, and generates safe, validated MySQL queries instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-600/25">
              Connect MySQL Free
            </Link>
            <Link href="/" className="inline-flex items-center justify-center text-slate-300 font-medium px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
              See all databases
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { title: 'MySQL dialect support', desc: 'Internite generates MySQL-compatible SQL with correct syntax, functions, and JOIN semantics for your version.' },
            { title: 'Works with MariaDB', desc: 'MariaDB is fully supported alongside standard MySQL. Connection handling is identical.' },
            { title: 'Schema intelligence', desc: 'Tables, columns, foreign keys, and indexes are indexed automatically. Complex joins are inferred.' },
            { title: 'Zero data migration', desc: 'Your MySQL data never leaves your server. Internite only reads schema metadata and executes read-only queries.' },
          ].map(f => (
            <div key={f.title} className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-2">{f.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-orange-950/60 to-slate-900 border border-orange-500/20 rounded-2xl p-10">
          <h2 className="text-2xl font-black text-white mb-3">Your MySQL database already has the answers.</h2>
          <p className="text-slate-300 mb-6">Connect in minutes. 100 free queries. No migration, no setup overhead.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-xl transition-all">
            Connect MySQL
          </Link>
        </div>
      </div>
    </main>
  )
}
