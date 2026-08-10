'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Database,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Clock,
  FileText,
  Key,
  Webhook,
  CreditCard,
  ChevronRight,
  Command,
  LayoutDashboard,
  BookOpen,
  Users,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  category: 'navigation' | 'action' | 'recent' | 'settings'
  href?: string
  action?: () => void
  keywords?: string[]
}

// ============================================
// CONSTANTS
// ============================================

const NAVIGATION_ITEMS: CommandItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', description: 'Go to dashboard', icon: LayoutDashboard, category: 'navigation', href: '/dashboard' },
  { id: 'nav-chat', label: 'AI Chat', description: 'Chat with your databases', icon: MessageSquare, category: 'navigation', href: '/dashboard/chat' },
  { id: 'nav-visualizer', label: 'Data Visualizer', description: 'Create visualizations', icon: BarChart3, category: 'navigation', href: '/dashboard/visualizer' },
  { id: 'nav-dashboards', label: 'Dashboards', description: 'View your dashboards', icon: LayoutDashboard, category: 'navigation', href: '/dashboard/dashboards' },
  { id: 'nav-databases', label: 'Databases', description: 'Manage connections', icon: Database, category: 'navigation', href: '/dashboard/databases' },
  { id: 'nav-queries', label: 'Saved Queries', description: 'Your saved queries', icon: FileText, category: 'navigation', href: '/dashboard/queries' },
  { id: 'nav-knowledge', label: 'Knowledge Base', description: 'RAG documents', icon: BookOpen, category: 'navigation', href: '/dashboard/knowledge' },
]

const ACTION_ITEMS: CommandItem[] = [
  { id: 'action-new-db', label: 'Connect Database', description: 'Add a new database', icon: Plus, category: 'action', href: '/dashboard/databases/new', keywords: ['connect', 'add', 'create'] },
  { id: 'action-new-query', label: 'New Query', description: 'Create a new saved query', icon: Plus, category: 'action', href: '/dashboard/queries?new=true', keywords: ['create', 'add', 'sql'] },
  { id: 'action-new-visualization', label: 'New Visualization', description: 'Create a chart', icon: Plus, category: 'action', href: '/dashboard/visualizer?new=true', keywords: ['chart', 'graph', 'create'] },
  { id: 'action-new-dashboard', label: 'New Dashboard', description: 'Create a dashboard', icon: Plus, category: 'action', href: '/dashboard/dashboards?new=true', keywords: ['create', 'add'] },
]

const SETTINGS_ITEMS: CommandItem[] = [
  { id: 'settings-general', label: 'Settings', description: 'Account settings', icon: Settings, category: 'settings', href: '/dashboard/settings' },
  { id: 'settings-api-keys', label: 'API Keys', description: 'Manage API access', icon: Key, category: 'settings', href: '/dashboard/settings/api-keys' },
  { id: 'settings-webhooks', label: 'Webhooks', description: 'Configure integrations', icon: Webhook, category: 'settings', href: '/dashboard/settings/webhooks' },
  { id: 'settings-billing', label: 'Billing', description: 'Manage subscription', icon: CreditCard, category: 'settings', href: '/dashboard/billing' },
  { id: 'settings-usage', label: 'Usage', description: 'View usage metrics', icon: Activity, category: 'settings', href: '/dashboard/usage' },
  { id: 'settings-team', label: 'Team', description: 'Manage members', icon: Users, category: 'settings', href: '/dashboard/settings/team' },
]

const RECENT_ITEMS_KEY = 'internite_recent_items'

function getRecentItems(): CommandItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_ITEMS_KEY)
    if (stored) {
      const ids = JSON.parse(stored) as string[]
      return NAVIGATION_ITEMS.filter(item => ids.includes(item.id)).slice(0, 5)
    }
  } catch {}
  return []
}

function addToRecent(item: CommandItem) {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(RECENT_ITEMS_KEY)
    const ids: string[] = stored ? JSON.parse(stored) : []
    const filtered = ids.filter(id => id !== item.id)
    filtered.unshift(item.id)
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(filtered.slice(0, 10)))
  } catch {}
}

// ============================================
// COMPONENT
// ============================================

export function CommandPalette() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentItems, setRecentItems] = useState<CommandItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent items
  useEffect(() => {
    setRecentItems(getRecentItems())
  }, [])

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter items based on query
  const filteredItems = useCallback(() => {
    const allItems = [...recentItems, ...NAVIGATION_ITEMS, ...ACTION_ITEMS, ...SETTINGS_ITEMS]

    if (!query.trim()) {
      return allItems.filter((item, index, self) =>
        index === self.findIndex(i => i.id === item.id)
      )
    }

    const lowerQuery = query.toLowerCase()
    return allItems.filter(item => {
      const matchesLabel = item.label.toLowerCase().includes(lowerQuery)
      const matchesDesc = item.description?.toLowerCase().includes(lowerQuery)
      const matchesKeywords = item.keywords?.some(k => k.includes(lowerQuery))
      return matchesLabel || matchesDesc || matchesKeywords
    }).filter((item, index, self) =>
      index === self.findIndex(i => i.id === item.id)
    )
  }, [query, recentItems])

  // Group items by category
  const groupedItems = useCallback(() => {
    const items = filteredItems()
    return {
      recent: items.filter(i => i.category === 'recent'),
      navigation: items.filter(i => i.category === 'navigation'),
      action: items.filter(i => i.category === 'action'),
      settings: items.filter(i => i.category === 'settings'),
    }
  }, [filteredItems])

  // Handle navigation
  const navigate = useCallback((item: CommandItem) => {
    addToRecent(item)
    setRecentItems(getRecentItems())

    if (item.href) {
      router.push(item.href)
    } else if (item.action) {
      item.action()
    }
    setIsOpen(false)
    setQuery('')
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    const items = filteredItems()

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && items[selectedIndex]) {
        navigate(items[selectedIndex])
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown as any)
      return () => document.removeEventListener('keydown', handleKeyDown as any)
    }
  }, [isOpen, selectedIndex, filteredItems, navigate])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const grouped = groupedItems()

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl hover:bg-slate-800/90 transition-all backdrop-blur-xl group"
      >
        <Search size={16} className="text-slate-400" />
        <span className="text-sm text-slate-400 font-medium">Search...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-lg text-xs text-slate-500 font-mono">
          <Command size={12} />K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
            >
              <div className="bg-[#0D111A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800/80">
                  <Search size={18} className="text-slate-500 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search Internite AI..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
                    autoFocus
                  />
                  <kbd className="px-2 py-1 bg-slate-800 rounded-lg text-xs text-slate-500 font-mono">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto p-2">
                  {filteredItems().length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-sm">
                      No results found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Recent */}
                      {grouped.recent.length > 0 && (
                        <div>
                          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={12} />
                            Recent
                          </p>
                          {grouped.recent.map(item => (
                            <CommandItemRow
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === filteredItems().indexOf(item)}
                              onClick={() => navigate(item)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Navigation */}
                      {grouped.navigation.length > 0 && (
                        <div>
                          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <LayoutDashboard size={12} />
                            Navigate
                          </p>
                          {grouped.navigation.map(item => (
                            <CommandItemRow
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === filteredItems().indexOf(item)}
                              onClick={() => navigate(item)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {grouped.action.length > 0 && (
                        <div>
                          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Plus size={12} />
                            Actions
                          </p>
                          {grouped.action.map(item => (
                            <CommandItemRow
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === filteredItems().indexOf(item)}
                              onClick={() => navigate(item)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Settings */}
                      {grouped.settings.length > 0 && (
                        <div>
                          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Settings size={12} />
                            Settings
                          </p>
                          {grouped.settings.map(item => (
                            <CommandItemRow
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === filteredItems().indexOf(item)}
                              onClick={() => navigate(item)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-3 border-t border-slate-800/80 bg-slate-900/50 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono">ESC</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================
// COMMAND ITEM ROW
// ============================================

function CommandItemRow({
  item,
  isSelected,
  onClick,
}: {
  item: CommandItem
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
        isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'hover:bg-slate-800/60 text-slate-300'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'
      )}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.label}</p>
        {item.description && (
          <p className="text-xs text-slate-500 truncate">{item.description}</p>
        )}
      </div>
      {isSelected && <ChevronRight size={16} className="text-indigo-400 shrink-0" />}
    </button>
  )
}

// ============================================
// EXPORTS
// ============================================
