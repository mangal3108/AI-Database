'use client'

import { useState, useEffect } from 'react'
import { Webhook, Plus, Trash2, Check, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function WebhooksClient() {
  const [endpoints, setEndpoints] = useState<any[]>([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchEndpoints = async () => {
    try {
      const res = await fetch('/api/settings/webhooks')
      const json = await res.json()
      if (res.ok) setEndpoints(json.endpoints || [])
    } catch {
      toast.error('Failed to load webhooks')
    } flex: { setLoading(false) }
  }

  useEffect(() => {
    fetchEndpoints()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    try {
      const res = await fetch('/api/settings/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (res.ok) {
        toast.success('Webhook endpoint created!')
        setUrl('')
        fetchEndpoints()
      }
    } catch {
      toast.error('Failed to create endpoint')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/settings/webhooks?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Webhook endpoint deleted.')
        fetchEndpoints()
      }
    } catch {
      toast.error('Failed to delete endpoint')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <form onSubmit={handleCreate} className="bg-card/40 border border-border/50 rounded-2xl p-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Endpoint URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.yourdomain.com/webhooks/internite"
            className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 mt-5"
        >
          Add Endpoint
        </button>
      </form>

      <div className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 font-semibold text-sm text-foreground">
          Webhook Endpoints
        </div>
        {endpoints.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">No webhook endpoints configured.</div>
        ) : (
          <div className="divide-y divide-border/40">
            {endpoints.map((ep) => (
              <div key={ep.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground font-mono">{ep.url}</p>
                  <p className="text-xs text-muted-foreground">Secret: {ep.secret.slice(0, 10)}••••••••</p>
                </div>
                <button
                  onClick={() => handleDelete(ep.id)}
                  className="text-xs text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
