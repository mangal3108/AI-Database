import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowUpRight, Database, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Saved Queries — Internite' }

export default async function QueriesPage() {
  const session = await auth()
  const membership = await prisma.membership.findFirst({ where: { userId: session?.user?.id ?? '' } })
  const savedQueries = membership ? await prisma.savedQuery.findMany({
    where: { organizationId: membership.organizationId },
    include: { query: { include: { connection: { select: { name: true, type: true } } } } },
    orderBy: { updatedAt: 'desc' },
  }) : []

  return (
    <div className="p-5 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-7">
      <div className="border-b border-[#e5e5e7] pb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Workspace</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">Saved queries</h1>
        <p className="mt-2 text-sm text-[#6e6e73]">Keep useful read-only queries close at hand.</p>
      </div>

      {savedQueries.length === 0 ? (
        <div className="rounded-2xl border border-[#e5e5e7] bg-white p-12 text-center">
          <MessageSquare className="mx-auto text-indigo-600" size={24} />
          <h2 className="mt-4 text-lg font-semibold text-[#1d1d1f]">No saved queries yet</h2>
          <p className="mt-2 text-sm text-[#6e6e73]">Save a useful result from Chat and it will appear here.</p>
          <Link href="/dashboard/chat" className="mt-5 inline-flex rounded-lg bg-[#1d1d1f] px-4 py-2.5 text-xs font-semibold text-white">Open chat</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedQueries.map(saved => (
            <article key={saved.id} className="rounded-2xl border border-[#e5e5e7] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#1d1d1f]">{saved.name}</h2>
                  <p className="mt-1 text-xs text-[#6e6e73]">{saved.description || 'Read-only saved query'}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">{saved.queryLanguage.toUpperCase()}</span>
              </div>
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-[#f7f7f5] p-3 text-[11px] text-slate-700">{saved.rawQuery}</pre>
              <div className="mt-4 flex items-center justify-between border-t border-[#e5e5e7] pt-3 text-xs text-[#6e6e73]">
                <span className="flex items-center gap-1.5"><Database size={13} />{saved.query?.connection?.name || 'Database'}</span>
                <Link href="/dashboard/chat" className="flex items-center gap-1 font-semibold text-indigo-600">Open chat <ArrowUpRight size={13} /></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
