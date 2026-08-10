import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, LayoutGrid, BarChart3, Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard View — Internite AI',
}

export default async function DashboardDetailPage({
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

  const dashboard = await prisma.dashboard.findFirst({
    where: { id, organizationId: membership.organizationId },
  })

  if (!dashboard) return notFound()

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto font-sans">
      {/* Back button */}
      <Link
        href="/dashboard/dashboards"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to dashboards
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{dashboard.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {dashboard.description || 'No description provided for this visual dashboard.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chat"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Add Query Chart</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Canvas Empty Grid */}
      <div className="bg-[#0D111A] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={24} />
        </div>
        <h3 className="text-base font-bold text-white">Dashboard Canvas Ready</h3>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Pin saved AI query visualizations and database analytical charts to this dashboard.
        </p>
        <Link
          href="/dashboard/chat"
          className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus size={14} />
          <span>Pin Query Chart</span>
        </Link>
      </div>
    </div>
  )
}
