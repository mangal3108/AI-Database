'use client'

import { Shield, Building2, Users, Lock, FileText, Database } from 'lucide-react'

export function MultiTenantSection() {
  return (
    <section className="py-24 border-t border-slate-800/60 bg-[#07090E] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">ENTERPRISE SAAS ISOLATION</p>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Built for organizations, <span className="text-[#60A5FA]">not just individual users.</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Internite AI is constructed ground-up as a true multi-tenant SaaS architecture. Complete tenant isolation across databases, RAG knowledge vectors, API keys, and audit logs.
        </p>

        {/* Visual Tenant Isolation Hierarchy */}
        <div className="mt-14 max-w-4xl mx-auto bg-[#0D111A] border border-slate-800 rounded-3xl p-8 text-left shadow-2xl relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Workspace A */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Acme Corp Workspace</h3>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>DB 1: Prod Postgres</span>
                  <span className="text-[10px] text-emerald-400">Isolated</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>RAG Vector Namespace</span>
                  <span className="text-[10px] text-emerald-400">Isolated</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>Audit Logs & RBAC</span>
                  <span className="text-[10px] text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* Workspace B */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white">Stripe Inc Workspace</h3>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>DB 1: Mongo Prod</span>
                  <span className="text-[10px] text-emerald-400">Isolated</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>RAG Vector Namespace</span>
                  <span className="text-[10px] text-emerald-400">Isolated</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>Audit Logs & RBAC</span>
                  <span className="text-[10px] text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* Workspace C */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white">Vercel Workspace</h3>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>DB 1: Neon Postgres</span>
                  <span className="text-[10px] text-emerald-400">Isolated</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>RAG Vector Namespace</span>
                  <span className="text-[10px] text-emerald-400">Isolated</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>Audit Logs & RBAC</span>
                  <span className="text-[10px] text-emerald-400">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-indigo-400" />
              <span>Multi-User RBAC Roles (Owner, Admin, Member, Viewer)</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-indigo-400" />
              <span>Zero Cross-Tenant Leakage</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" />
              <span>Immutable Audit Logs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
