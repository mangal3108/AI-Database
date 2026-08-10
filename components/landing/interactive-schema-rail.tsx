'use client'

import { useState } from 'react'
import { Database, Table2, Layers, CheckCircle2, ChevronRight, HardDrive } from 'lucide-react'

const DATABASES = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    type: 'Relational Database',
    tables: ['customers (42,800 rows)', 'orders (184,200 rows)', 'payments (184,200 rows)', 'products (1,240 rows)'],
    querySample: 'SELECT c.name, SUM(p.amount) FROM customers c JOIN payments p...',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'Document Database',
    tables: ['users (120,400 docs)', 'orders (450,100 docs)', 'events (2.4M docs)', 'products (850 docs)'],
    querySample: 'db.orders.aggregate([{ $match: { status: "completed" } }, { $group: ... }])',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    type: 'Postgres Cloud DB',
    tables: ['auth.users (15,200 rows)', 'profiles (15,200 rows)', 'subscriptions (4,100 rows)'],
    querySample: 'SELECT p.full_name, s.plan FROM profiles p JOIN subscriptions s...',
  },
  {
    id: 'neon',
    name: 'Neon Postgres',
    type: 'Serverless Postgres',
    tables: ['analytics_events (5.2M rows)', 'tenant_metadata (420 rows)', 'ai_cache (12,800 rows)'],
    querySample: 'SELECT tenant_id, COUNT(*) FROM analytics_events GROUP BY tenant_id...',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'Relational Database',
    tables: ['wp_users (8,400 rows)', 'wp_posts (42,100 rows)', 'wp_options (1,200 rows)'],
    querySample: 'SELECT post_title, comment_count FROM wp_posts WHERE post_status = "publish"...',
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    type: 'Enterprise RDBMS',
    tables: ['dbo.SalesOrderHeader (840k rows)', 'dbo.Customer (120k rows)', 'dbo.Product (5k rows)'],
    querySample: 'SELECT TOP 10 c.CompanyName, SUM(soh.TotalDue) FROM SalesOrderHeader...',
  },
]

export function InteractiveSchemaRail() {
  const [selectedDb, setSelectedDb] = useState(DATABASES[0]!)

  return (
    <section id="integrations" className="py-24 border-t border-slate-800/60 bg-[#07090E] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">MULTI-DATABASE ABSTRACTION LAYER</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          One AI layer. <span className="text-[#60A5FA]">Every database.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 font-normal">
          Internite AI normalizes PostgreSQL, MySQL, MongoDB, Supabase, Neon, and SQL Server into a single unified semantic knowledge graph.
        </p>

        {/* Database Selection Rail */}
        <div className="flex flex-wrap justify-center gap-3 my-10">
          {DATABASES.map(db => (
            <button
              key={db.id}
              onClick={() => setSelectedDb(db)}
              className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                selectedDb.id === db.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Database size={16} className={selectedDb.id === db.id ? 'text-indigo-400' : 'text-slate-500'} />
              <span>{db.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Schema Preview Card */}
        <div className="max-w-4xl mx-auto bg-[#0D111A] border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{selectedDb.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedDb.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Unified schema auto-indexed via Hybrid RAG pipeline</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={14} />
              <span>Schema Discovered & Vectorized</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* Discovered Entities */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Table2 size={14} className="text-indigo-400" />
                <span>Discovered Entities / Schema</span>
              </p>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                {selectedDb.tables.map((t, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                    <span>{t}</span>
                    <ChevronRight size={14} className="text-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Abstract Query */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HardDrive size={14} className="text-indigo-400" />
                <span>Native Query Output</span>
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300/90 h-[140px] overflow-auto">
                <pre>{selectedDb.querySample}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
