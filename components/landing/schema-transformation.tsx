'use client'

import { ArrowRight, Sparkles } from 'lucide-react'

export function SchemaTransformation() {
  return (
    <section className="py-24 border-t border-slate-800/60 bg-[#050505] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">SEMANTIC INTELLIGENCE</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Messy database. <span className="text-[#60A5FA]">Smart AI understanding.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Internite AI doesn&apos;t just read column names — it learns what your legacy data structures actually mean in real-world business context.
        </p>

        {/* Before / After Transformation Box */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Cryptic Legacy Schema (Before) */}
          <div className="bg-[#0D111A] border border-rose-500/20 rounded-3xl p-6 sm:p-8 relative">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider mb-4 inline-block">
              BEFORE — Cryptic Legacy DB
            </span>
            <div className="font-mono text-xs text-slate-400 space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-rose-400 font-bold">cust_mst</p>
              <p className="pl-4">├── c_id_pk (INT)</p>
              <p className="pl-4">├── cust_seg_cd (VARCHAR)</p>
              <p className="pl-4">└── lst_act_dt (TIMESTAMP)</p>

              <p className="text-rose-400 font-bold pt-2">ord_hdr</p>
              <p className="pl-4">├── ord_id (UUID)</p>
              <p className="pl-4">├── cust_fk (INT)</p>
              <p className="pl-4">└── amt_net (DECIMAL)</p>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Hard to read, inconsistent acronyms, undocumented foreign key constraints.
            </p>
          </div>

          {/* Internite Semantic Representation (After) */}
          <div className="bg-[#0D111A] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative shadow-xl shadow-indigo-500/5">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider mb-4 inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-indigo-400" />
              AFTER — Internite AI Semantic Layer
            </span>
            <div className="font-mono text-xs text-slate-200 space-y-2 bg-slate-950 p-4 rounded-xl border border-indigo-500/30">
              <p className="text-indigo-300 font-bold">Customer (Entity)</p>
              <p className="pl-4 text-slate-400">└── Orders (1-to-N Relationship)</p>
              <p className="pl-8 text-slate-400">├── Products</p>
              <p className="pl-8 text-emerald-400">├── Revenue (Calculated Field)</p>
              <p className="pl-8 text-slate-400">└── Transactions</p>
            </div>
            <p className="text-xs text-indigo-300/80 mt-4 font-medium">
              Automatically inferred entity graphs and business logic metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
