'use client'

import { motion } from 'framer-motion'
import { Cpu, Database, Shield, Layers, ArrowDown, Sparkles, Network } from 'lucide-react'

import { SectionBackground } from '@/components/landing/section-background'

export function ArchitectureDiagram() {
  return (
    <section className="py-24 border-t border-slate-800/60 bg-[#050505] relative overflow-hidden">
      <SectionBackground theme="purple" opacity={0.35} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">NEXT-GEN SYSTEM ARCHITECTURE</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How Internite AI <span className="text-[#60A5FA]">processes your prompt</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          From natural language input to safe, validated execution across multi-tenant database adapters.
        </p>

        {/* Visual Architecture Flow Diagram */}
        <div className="my-16 max-w-4xl mx-auto relative bg-[#0D111A]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
          {/* User Prompt Input Box */}
          <div className="flex justify-center">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg flex items-center gap-3">
              <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              <span>User Question: &ldquo;Which products generated the most revenue this quarter?&rdquo;</span>
            </div>
          </div>

          <div className="flex justify-center my-4">
            <ArrowDown className="text-indigo-500 animate-bounce" size={20} />
          </div>

          {/* Engine Core Row */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-6">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-4 text-center">1. INTENT & SCHEMATIC INTELLIGENCE LAYER</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-left">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
                  <Network size={14} />
                  <span>Schema Graph</span>
                </div>
                <p className="text-[11px] text-slate-400">Maps 140+ foreign keys & table relationships into a unified semantic graph.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-left">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
                  <Layers size={14} />
                  <span>Hybrid RAG Engine</span>
                </div>
                <p className="text-[11px] text-slate-400">Combines pgvector similarity with BM25 keyword matching for context retrieval.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-left">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
                  <Cpu size={14} />
                  <span>Query Planner</span>
                </div>
                <p className="text-[11px] text-slate-400">Constructs index-optimized SQL / Mongo queries with dialect translation.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center my-4">
            <ArrowDown className="text-indigo-500 animate-bounce" size={20} />
          </div>

          {/* Safety Engine Guard */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <Shield size={20} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-300">2. ZERO-TRUST SAFETY ENGINE</p>
                <p className="text-[11px] text-slate-400">Validates AST to block DROP, DELETE, UPDATE, and unauthorized schema access.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PASSED: READ-ONLY
            </span>
          </div>

          <div className="flex justify-center my-4">
            <ArrowDown className="text-indigo-500 animate-bounce" size={20} />
          </div>

          {/* Multi-Database Adapters */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-3 text-center">3. ISOLATED TENANT DATABASE ADAPTERS</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300 flex items-center justify-center gap-2">
                <Database size={14} className="text-indigo-400" />
                <span>PostgreSQL</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300 flex items-center justify-center gap-2">
                <Database size={14} className="text-indigo-400" />
                <span>MongoDB</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300 flex items-center justify-center gap-2">
                <Database size={14} className="text-indigo-400" />
                <span>MySQL</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-slate-300 flex items-center justify-center gap-2">
                <Database size={14} className="text-indigo-400" />
                <span>Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
