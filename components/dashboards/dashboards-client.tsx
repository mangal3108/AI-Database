'use client'

import React, { useState, useEffect } from 'react'
import { Plus, BarChart3, Clock, LayoutGrid, X, Loader2, Sparkles, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

interface Dashboard {
  id: string
  name: string
  description?: string | null
  updatedAt: Date | string
}

export function DashboardsClient({ initialDashboards }: { initialDashboards: Dashboard[] }) {
  const router = useRouter()
  const [dashboards, setDashboards] = useState<Dashboard[]>(initialDashboards)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })

      if (!res.ok) throw new Error('Failed to create dashboard')

      const data = await res.json()
      toast.success('Dashboard created!')
      setDashboards([data.dashboard, ...dashboards])
      setName('')
      setDescription('')
      setIsModalOpen(false)
      router.refresh()
    } catch {
      toast.error('Failed to create dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans space-y-8 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
            <LayoutGrid size={13} />
            <span>ANALYTICS WORKSPACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Executive Dashboards</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Combine saved queries, automated charts, and live database metrics into unified visual workspaces.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-indigo-600/20 shrink-0 cursor-pointer"
        >
          <Plus size={15} />
          <span>New Dashboard</span>
        </button>
      </div>

      {dashboards.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)]">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-950">No dashboards created yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Combine your saved query charts and key database performance metrics into unified executive dashboards.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Plus size={15} />
            <span>Create Dashboard</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dashboards.map((d) => (
            <Link
              key={d.id}
              href={`/dashboard/dashboards/${d.id}`}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-[0_16px_40px_-28px_rgba(37,99,235,0.6)] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <LayoutGrid size={15} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{d.name}</h3>
                </div>
                {d.description && <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{d.description}</p>}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>Updated {new Date(d.updatedAt).toLocaleDateString()}</span>
                </span>
                <ChevronRight size={13} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-950">Create Executive Dashboard</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">Dashboard Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Executive Overview Q3"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1.5">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summary of KPIs and query widgets in this dashboard..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Create Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
