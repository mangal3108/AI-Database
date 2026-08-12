'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MessageSquare, BarChart3, Layers, Sparkles, Database,
  BookOpen, Code2, Key, Webhook, Activity, CreditCard, Settings, Plus, Command
} from 'lucide-react'

interface CommandGroup {
  category: string
  items: {
    label: string
    href?: string
    action?: () => void
    icon: React.ComponentType<{ size?: number; className?: string }>
    badge?: string
  }[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const groups: CommandGroup[] = [
    {
      category: 'ACTIONS',
      items: [
        { label: 'New chat', href: '/dashboard/chat', icon: Plus, badge: '⌘ N' },
        { label: 'Connect New Database', href: '/dashboard/databases/new', icon: Database },
        { label: 'Create Visualization', href: '/dashboard/visualizer', icon: BarChart3 },
      ],
    },
    {
      category: 'WORKSPACE',
      items: [
        { label: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
        { label: 'Data Visualizer', href: '/dashboard/visualizer', icon: BarChart3 },
        { label: 'Dashboards', href: '/dashboard/dashboards', icon: Layers },
        { label: 'Saved Queries', href: '/dashboard/queries', icon: Sparkles },
      ],
    },
    {
      category: 'DATA & DEVELOPER',
      items: [
        { label: 'Databases', href: '/dashboard/databases', icon: Database },
        { label: 'Knowledge', href: '/dashboard/knowledge', icon: BookOpen },
        { label: 'API Reference', href: '/developers/api', icon: Code2 },
        { label: 'API Keys', href: '/dashboard/settings/api-keys', icon: Key },
        { label: 'Webhooks', href: '/dashboard/settings/webhooks', icon: Webhook },
      ],
    },
    {
      category: 'ACCOUNT',
      items: [
        { label: 'Usage', href: '/dashboard/usage', icon: Activity },
        { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { label: 'Workspace Settings', href: '/dashboard/settings', icon: Settings },
      ],
    },
  ]

  const filteredGroups = groups.map(g => ({
    ...g,
    items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.items.length > 0)

  const handleSelect = (href?: string, action?: () => void) => {
    setOpen(false)
    setSearch('')
    if (action) action()
    else if (href) router.push(href)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl bg-[#111113]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            {/* Input Header */}
            <div className="flex items-center px-4 h-14 border-b border-white/10">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search commands, pages, or actions... (Esc to close)"
                className="w-full bg-transparent px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                autoFocus
              />
              <span className="text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-4">
              {filteredGroups.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No matching commands found
                </div>
              ) : (
                filteredGroups.map(g => (
                  <div key={g.category}>
                    <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      {g.category}
                    </div>
                    <div className="space-y-0.5">
                      {g.items.map(i => (
                        <div
                          key={i.label}
                          onClick={() => handleSelect(i.href, i.action)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <i.icon size={15} className="text-slate-400" />
                            <span className="font-medium">{i.label}</span>
                          </div>
                          {i.badge && (
                            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                              {i.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span>Internite Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
