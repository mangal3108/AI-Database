'use client'

import { Layers, Database, Binary, GitMerge, FileText } from 'lucide-react'

export function RagVisualization() {
  return (
    <section id="rag" className="py-24 border-t border-slate-800/60 bg-[#07090E] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">HYBRID VECTOR RAG PIPELINE</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Your schema is knowledge. <span className="text-[#60A5FA]">We make it searchable.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Internite AI parses raw table structures, foreign key relationships, enum values, and metadata comments into dense vector embeddings for instantaneous sub-10ms retrieval.
        </p>

        {/* Visual Pipeline Box */}
        <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          {/* Step 1 */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition-colors">
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <Database size={20} />
            </div>
            <p className="text-xs font-mono text-slate-500 mb-1">STEP 01</p>
            <h3 className="text-base font-bold text-white mb-2">Schema Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-discovers tables, views, foreign keys, constraints, and data dictionaries.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition-colors">
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <Binary size={20} />
            </div>
            <p className="text-xs font-mono text-slate-500 mb-1">STEP 02</p>
            <h3 className="text-base font-bold text-white mb-2">Vector Embeddings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates 1536-dimensional embeddings for column definitions & business terminology.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition-colors">
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <GitMerge size={20} />
            </div>
            <p className="text-xs font-mono text-slate-500 mb-1">STEP 03</p>
            <h3 className="text-base font-bold text-white mb-2">Hybrid Retrieval</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Merges cosine vector similarity with exact BM25 keyword matching for 99.4% context precision.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 relative group hover:border-indigo-500/40 transition-colors">
            <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <FileText size={20} />
            </div>
            <p className="text-xs font-mono text-slate-500 mb-1">STEP 04</p>
            <h3 className="text-base font-bold text-white mb-2">Context Injection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Feeds exact, minimal schematic context into the AI Gateway for safe query generation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
