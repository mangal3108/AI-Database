'use client'

import React, { useState, useEffect } from 'react'
import { Plus, BarChart3, Clock, LayoutGrid, X, Loader2, Sparkles } from 'lucide-react'
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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <LayoutGrid className="text-indigo-400" size={26} />
            <span>Dashboards</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Create and view interactive visual dashboards from saved database queries.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>New Dashboard</span>
        </button>
      </div>

      {dashboards.length === 0 ? (
        <div className="bg-[#0D111A] border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-base font-bold text-white">No dashboards created yet</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Combine your saved query charts and key database performance metrics into unified executive dashboards.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
          >
            <Plus size={16} />
            <span>Create Dashboard</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboards.map((d) => (
            <div key={d.id} className="bg-[#0D111A] border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid size={16} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{d.name}</h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{d.description || 'No description provided.'}</p>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{mounted ? new Date(d.updatedAt).toLocaleDateString() : ''}</span>
                </span>
                <Link
                  href={`/dashboard/dashboards/${d.id}`}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                >
                  View Dashboard →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dashboard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <Sparkles className="text-indigo-400" size={20} />
              <h2 className="text-lg font-bold text-white">Create Visual Dashboard</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Dashboard Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Executive KPI Overview, E-Commerce Metrics"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of charts and queries aggregated in this dashboard"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{isLoading ? 'Creating...' : 'Create Dashboard'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
