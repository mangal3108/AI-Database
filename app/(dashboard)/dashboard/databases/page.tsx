import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Database, CheckCircle2, AlertCircle, RefreshCw, Activity, ChevronRight, Shield, Zap } from 'lucide-react'
import { DatabaseLogo } from '@/components/database/database-logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Databases — Internite AI',
}

export default async function DatabasesPage() {
  const session = await auth()
  const membership = await prisma.membership.findFirst({ where: { userId: session?.user?.id ?? '' } })

  const connections = membership ? await prisma.databaseConnection.findMany({
    where: { organizationId: membership.organizationId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  }) : []

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
            <Activity size={13} />
            <span>DATA SOURCES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Connected Databases</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage production database connections, schema indexing, and Connection Doctor diagnostics.
          </p>
        </div>
        <Link
          href="/dashboard/databases/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm shadow-indigo-600/20"
        >
          <Plus size={15} />
          <span>Connect Database</span>
        </Link>
      </div>

      {/* Empty State */}
      {connections.length === 0 && (
        <div className="p-12 rounded-3xl bg-[#111113]/80 border border-white/5 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
            <Database size={24} />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">No databases connected yet</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect your PostgreSQL, MySQL, MongoDB, Supabase, or Neon database to activate natural-language querying &amp; schema intelligence.
          </p>
          <Link
            href="/dashboard/databases/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus size={15} />
            <span>Connect First Database</span>
          </Link>
        </div>
      )}

      {/* Connections List */}
      {connections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {connections.map(conn => {
            const isError = conn.status === 'ERROR'
            return (
              <Link
                key={conn.id}
                href={`/dashboard/databases/${conn.id}`}
                className="group p-5 bg-[#111113]/90 border border-white/5 rounded-2xl hover:border-white/10 hover:bg-[#141417] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center">
                      <DatabaseLogo type={conn.type} className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isError
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {conn.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    {conn.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{conn.type}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Read-Only Safety</span>
                  <div className="flex items-center gap-1 text-slate-300 group-hover:text-white transition-colors">
                    <span>Manage</span>
                    <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
