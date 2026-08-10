'use client'

import { useState, useEffect } from 'react'
import { Key, Plus, Trash2, Eye, EyeOff, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function ApiKeysClient() {
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/settings/api-keys')
      const json = await res.json()
      if (res.ok) setKeys(json.apiKeys || [])
    } catch {
      toast.error('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const res = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      if (res.ok) {
        setNewSecret(json.secretKey)
        setName('')
        toast.success('API key generated successfully!')
        fetchKeys()
      } else {
        toast.error(json.error || 'Failed to create key')
      }
    } catch {
      toast.error('Failed to create key')
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`/api/settings/api-keys?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('API key revoked.')
        fetchKeys()
      }
    } catch {
      toast.error('Failed to revoke key')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-card/40 border border-border/50 rounded-2xl p-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Key Description / Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production Backend Service"
            className="w-full bg-muted/40 border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 mt-5"
        >
          Create Secret Key
        </button>
      </form>

      {/* Secret Display Banner (Only Shown Once) */}
      {newSecret && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4">
          <p className="text-xs text-indigo-400 font-bold mb-1">⚠️ Save your secret key!</p>
          <p className="text-xs text-muted-foreground mb-3">
            This secret key will never be shown again. Copy it now and store it in a secure password manager.
          </p>
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-2.5 font-mono text-xs text-foreground">
            <span className="flex-1 truncate">{newSecret}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newSecret)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* Key List */}
      <div className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 font-semibold text-sm text-foreground">
          Active Secret Keys
        </div>
        {keys.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">No API keys created yet.</div>
        ) : (
          <div className="divide-y divide-border/40">
            {keys.map((k) => (
              <div key={k.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{k.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{k.keyPrefix}••••••••••••••••</p>
                </div>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="text-xs text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all"
                  title="Revoke Key"
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
