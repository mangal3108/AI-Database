import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Database, ShieldCheck, Table2, Layers, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Key } from 'lucide-react'
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

  const totalTables = connection.schemas.reduce((acc, s) => acc + s.tables.length, 0)
  const totalColumns = connection.schemas.reduce(
    (acc, s) => acc + s.tables.reduce((tAcc, t) => tAcc + t.columns.length, 0),
    0
  )

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto font-sans">
      {/* Back button */}
      <Link
        href="/dashboard/databases"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to databases
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
            <Database size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{connection.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                {connection.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connected on {new Date(connection.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
            <RefreshCw size={14} className="text-indigo-400" />
            <span>Sync Schema</span>
          </button>
          <Link
            href={`/dashboard/chat?connectionId=${connection.id}`}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-600/20"
          >
            Start AI Chat →
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Connection Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connection.status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-base font-bold text-white">{connection.status}</span>
          </div>
        </div>

        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Schemas</p>
          <p className="text-xl font-bold text-white mt-1">{connection.schemas.length}</p>
        </div>

        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Tables</p>
          <p className="text-xl font-bold text-white mt-1">{totalTables}</p>
        </div>

        <div className="bg-[#0D111A] border border-slate-800 rounded-2xl p-5">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Columns</p>
          <p className="text-xl font-bold text-white mt-1">{totalColumns}</p>
        </div>
      </div>

      {/* Discovered Schemas & Tables Tree */}
      <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Table2 size={18} className="text-indigo-400" />
          <span>Discovered Database Schemas & Columns</span>
        </h2>

        {connection.schemas.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <p className="text-xs text-slate-400">Schema indexing in progress or no schemas discovered yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {connection.schemas.map(s => (
              <div key={s.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                    Schema: {s.name}
                  </span>
                  <span className="text-[11px] text-slate-500">{s.tables.length} tables</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {s.tables.map(t => (
                    <div key={t.id} className="bg-[#0D111A] border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white font-mono">{t.name}</span>
                        <span className="text-[10px] text-slate-500">{t.columns.length} cols</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.columns.slice(0, 6).map(c => (
                          <span
                            key={c.id}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              c.isPrimaryKey
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {c.name} {c.isPrimaryKey && '🔑'}
                          </span>
                        ))}
                        {t.columns.length > 6 && (
                          <span className="text-[10px] font-mono text-slate-500 px-1 py-0.5">
                            +{t.columns.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
