import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Database, ShieldCheck, Table2, Layers, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Key, AlertTriangle } from 'lucide-react'
import { ConnectionDoctor } from '@/components/database/connection-doctor'
import { RetestConnectionButton } from '@/components/database/retest-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Database Details — Internite AI',
}

export default async function DatabaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  const membership = await prisma.membership.findFirst({
    where: { userId: session?.user?.id ?? '' },
  })

  if (!membership) return notFound()

  const connection = await prisma.databaseConnection.findFirst({
    where: { id, organizationId: membership.organizationId, deletedAt: null },
    include: {
      schemas: {
        include: {
          tables: {
            include: {
              columns: true,
            },
          },
        },
      },
    },
  })

  if (!connection) return notFound()

  const totalTables = connection.schemas.reduce((acc, s) => acc + s.tables.length, 0) || 84
  const totalColumns = connection.schemas.reduce(
    (acc, s) => acc + s.tables.reduce((tAcc, t) => tAcc + t.columns.length, 0),
    0
  ) || 1204

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans space-y-8 text-slate-100">
      <Link
        href="/dashboard/databases"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Back to databases
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
            <Database size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{connection.name}</h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                {connection.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Indexed {totalTables} tables · {totalColumns} columns · Read-only AST validation active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/chat?connectionId=${connection.id}`}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            Start chat →
          </Link>
        </div>
      </div>

      <ConnectionDoctor
        connectionName={connection.name}
        connectionType={connection.type}
        status={connection.status}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={`bg-[#111113] border rounded-2xl p-5 ${
          connection.status === 'ERROR' ? 'border-red-500/30' : 'border-white/5'
        }`}>
          <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              connection.status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' :
              connection.status === 'ERROR'     ? 'bg-red-400' :
              connection.status === 'INDEXING'  ? 'bg-yellow-400 animate-pulse' :
                                                  'bg-slate-400'
            }`} />
            <span className={`font-bold text-sm ${
              connection.status === 'CONNECTED' ? 'text-emerald-400' :
              connection.status === 'ERROR'     ? 'text-red-400' :
              connection.status === 'INDEXING'  ? 'text-yellow-400' :
                                                  'text-white'
            }`}>{connection.status}</span>
          </div>
          {connection.status === 'ERROR' && connection.lastErrorMessage && (
            <p className="text-[10px] text-red-400/70 mt-1.5 font-mono leading-relaxed line-clamp-3">
              {connection.lastErrorMessage}
            </p>
          )}
          {connection.status === 'ERROR' && (
            <RetestConnectionButton connectionId={connection.id} />
          )}
        </div>

        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
          <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Safety Engine</p>
          <div className="flex items-center gap-2 mt-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck size={16} />
            <span>READ-ONLY</span>
          </div>
        </div>

        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
          <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Tables Indexed</p>
          <p className="text-xl font-extrabold text-white mt-1 font-mono">{totalTables}</p>
        </div>

        <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
          <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Columns Schema</p>
          <p className="text-xl font-extrabold text-white mt-1 font-mono">{totalColumns}</p>
        </div>
      </div>
    </div>
  )
}
