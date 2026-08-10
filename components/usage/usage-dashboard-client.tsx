'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Database, Cpu, MessageSquare, HardDrive, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function UsageDashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    fetch(`/api/usage?period=${period}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => toast.error('Failed to load usage metrics'))
      .finally(() => setLoading(false))
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    )
  }

  const metrics = data?.metrics || {}

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Time filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Usage Metrics Breakdown</h2>
        <div className="bg-muted/50 p-1 rounded-xl border border-border/50 flex items-center gap-1">
          {['today', '7d', '30d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg uppercase transition-all ${
                period === p ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard icon={Cpu} label="AI Queries" value={metrics.AI_QUERY ?? 0} color="text-indigo-400" bg="bg-indigo-500/10" />
        <MetricCard icon={BarChart3} label="AI Tokens Consumed" value={metrics.AI_TOKEN ?? 0} color="text-purple-400" bg="bg-purple-500/10" />
        <MetricCard icon={Database} label="Database Queries" value={metrics.DATABASE_QUERY ?? 0} color="text-blue-400" bg="bg-blue-500/10" />
        <MetricCard icon={FileText} label="RAG Documents" value={metrics.RAG_DOCUMENT ?? 0} color="text-green-400" bg="bg-green-500/10" />
        <MetricCard icon={HardDrive} label="Storage (MB)" value={metrics.STORAGE ?? 0} color="text-yellow-400" bg="bg-yellow-500/10" />
        <MetricCard icon={MessageSquare} label="Chat Messages" value={metrics.CHAT_MESSAGE ?? 0} color="text-pink-400" bg="bg-pink-500/10" />
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-card/40 border border-border/50 rounded-2xl p-5 backdrop-blur-sm">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3 border border-white/5`}>
        <Icon size={18} className={color} />
      </div>
      <p className="text-2xl font-black text-foreground">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
