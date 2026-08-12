'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Check, ChevronsUpDown, Plus, ShieldCheck, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Workspace {
  id: string
  name: string
  slug: string
  plan: string
  role: string
  isCurrent: boolean
}

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgSlug, setNewOrgSlug] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery<{ workspaces: Workspace[]; currentOrgId: string }>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await fetch('/api/organizations')
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string }) => {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to create workspace')
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success('Workspace created successfully!')
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      setIsModalOpen(false)
      setNewOrgName('')
      setNewOrgSlug('')
      window.location.reload()
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  const activeWorkspace = data?.workspaces.find(w => w.isCurrent) ?? data?.workspaces[0]

  const handleSelectWorkspace = (workspaceId: string) => {
    if (workspaceId === activeWorkspace?.id) return
    localStorage.setItem('active_org_id', workspaceId)
    toast.success('Switching workspace context...')
    setIsOpen(false)
    window.location.assign(`/dashboard?org=${workspaceId}`)
  }

  if (collapsed) {
    return (
      <div className="flex justify-center p-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs" title={activeWorkspace?.name}>
          {activeWorkspace?.name ? activeWorkspace.name.slice(0, 2).toUpperCase() : 'WS'}
        </div>
      </div>
    )
  }

  return (
    <div className="relative px-3 py-2">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground border border-sidebar-border transition-all text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
            {activeWorkspace?.name ? activeWorkspace.name.slice(0, 2).toUpperCase() : 'WS'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">{activeWorkspace?.name ?? 'Personal Workspace'}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{activeWorkspace?.plan ?? 'FREE'} Plan · {activeWorkspace?.role ?? 'OWNER'}</p>
          </div>
        </div>
        <ChevronsUpDown size={14} className="text-muted-foreground flex-shrink-0 ml-1" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-3 right-3 top-14 z-40 bg-popover border border-border rounded-xl shadow-xl p-1.5 space-y-1"
            >
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">Workspaces</p>
              
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {data?.workspaces.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => handleSelectWorkspace(ws.id)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-accent transition-colors text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{ws.name}</p>
                      <p className="text-[10px] text-muted-foreground">{ws.role} · {ws.plan}</p>
                    </div>
                    {ws.isCurrent && <Check size={14} className="text-primary flex-shrink-0 ml-2" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-border/50 pt-1">
                <button
                  onClick={() => { setIsOpen(false); setIsModalOpen(true) }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-primary font-medium hover:bg-primary/10 transition-colors"
                >
                  <Plus size={14} />
                  Create new workspace
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">Create Workspace</h3>
            <p className="text-xs text-muted-foreground">Each workspace is completely isolated with its own databases, RAG knowledge, conversations, and members.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Workspace Name</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={newOrgName}
                  onChange={e => {
                    setNewOrgName(e.target.value)
                    setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Workspace URL Slug</label>
                <input
                  type="text"
                  placeholder="acme-corp"
                  value={newOrgSlug}
                  onChange={e => setNewOrgSlug(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate({ name: newOrgName, slug: newOrgSlug })}
                disabled={!newOrgName.trim() || createMutation.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
              >
                {createMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
