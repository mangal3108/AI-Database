import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Database, CheckCircle2, AlertCircle, RefreshCw, Activity, ChevronRight, Shield, Zap } from 'lucide-react'
import { DatabaseLogo } from '@/components/database/database-logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Databases — Internite',
}

export default async function DatabasesPage() {
  const session = await auth()
  const membership = await prisma.membership.findFirst({ where: { userId: session?.user?.id ?? '' } })

  const connections = membership ? await prisma.databaseConnection.findMany({
    where: { organizationId: membership.organizationId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  }) : []

  return (
    <div className="p-5 sm:p-8 lg:p-12 max-w-7xl mx-auto font-sans space-y-8 text-[#1d1d1f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[#e5e5e7] pb-7">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
            <Activity size={13} />
            <span>DATA SOURCES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-[-0.04em]">Connected databases</h1>
          <p className="text-sm text-[#6e6e73] mt-2 max-w-xl">
            Manage connections, schema indexing, and diagnostics from one place.
          </p>
        </div>
        <Link
          href="/dashboard/databases/new"
          className="flex items-center gap-2 bg-[#1d1d1f] hover:bg-black text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-all"
        >
          <Plus size={15} />
          <span>Connect Database</span>
        </Link>
      </div>

      {/* Empty State */}
      {connections.length === 0 && (
        <div className="p-12 rounded-3xl bg-white border border-[#e5e5e7] text-center space-y-4 max-w-xl mx-auto shadow-[0_1px_2px_rgba(0,0,0,.03)]">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
            <Database size={24} />
          </div>
          <h2 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">No databases connected yet</h2>
          <p className="text-sm text-[#6e6e73] leading-relaxed">
            Connect PostgreSQL, MySQL, MongoDB, Supabase, or Neon to start exploring your data.
          </p>
          <Link
            href="/dashboard/databases/new"
            className="inline-flex items-center gap-2 bg-[#1d1d1f] hover:bg-black text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-all"
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
                className="group p-5 bg-white border border-[#e5e5e7] rounded-2xl hover:border-[#c7c7cc] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f7f7f5] border border-[#e5e5e7] flex items-center justify-center">
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

                  <h3 className="font-semibold text-[#1d1d1f] text-base group-hover:text-indigo-600 transition-colors">
                    {conn.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{conn.type}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#e5e5e7] flex items-center justify-between text-[11px] text-[#6e6e73]">
                  <span>Read-Only Safety</span>
                  <div className="flex items-center gap-1 text-[#1d1d1f] group-hover:text-indigo-600 transition-colors">
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
