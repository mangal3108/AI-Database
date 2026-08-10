'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MessageSquare,
  BarChart3,
  Database,
  BookOpen,
  Activity,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  User,
  LogOut,
  Sparkles,
  Layers,
  Code2,
  Key,
  Webhook,
  Menu,
  X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'WORKSPACE',
    items: [
      { href: '/dashboard/chat', icon: MessageSquare, label: 'AI Chat' },
      { href: '/dashboard/visualizer', icon: BarChart3, label: 'Data Visualizer' },
      { href: '/dashboard/dashboards', icon: Layers, label: 'Dashboards' },
      { href: '/dashboard/queries', icon: Sparkles, label: 'Saved Queries' },
    ],
  },
  {
    title: 'DATA',
    items: [
      { href: '/dashboard/databases', icon: Database, label: 'Databases' },
      { href: '/dashboard/knowledge', icon: BookOpen, label: 'Knowledge / RAG' },
    ],
  },
  {
    title: 'DEVELOPER',
    items: [
      { href: '/developers/api', icon: Code2, label: 'API Reference' },
      { href: '/dashboard/settings/api-keys', icon: Key, label: 'API Keys' },
      { href: '/dashboard/settings/webhooks', icon: Webhook, label: 'Webhooks' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { href: '/dashboard/usage', icon: Activity, label: 'Usage' },
      { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

interface DashboardSidebarProps {
  user: Session['user']
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Fetch real AI queries usage count
  const { data: usageData } = useQuery({
    queryKey: ['sidebarUsage'],
    queryFn: async () => {
      const res = await fetch('/api/usage')
      if (!res.ok) return { used: 0, limit: 100, plan: 'FREE' }
      const data = await res.json()
      const used = data.metrics?.AI_QUERY ?? data.metrics?.ai_queries ?? 0
      return { used, limit: 100, plan: 'FREE' }
    },
    refetchInterval: 10000,
  })

  const usedQueries = usageData?.used ?? 0
  const limitQueries = usageData?.limit ?? 100
  const usagePercentage = Math.min(Math.round((usedQueries / limitQueries) * 100), 100)

  const sidebarContent = (
    <div className="flex flex-col h-full font-sans">
      {/* Brand / Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-extrabold text-lg tracking-tight font-sans">
            <span className="text-white">INTERN</span>
            <span className="text-[#60A5FA]">ITE</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#60A5FA] border border-[#60A5FA]/30">
            AI
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Workspace Selector */}
      <div className="p-3 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2 p-2 bg-sidebar-accent rounded-xl border border-sidebar-border">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
            {user?.name ? user.name[0]?.toUpperCase() : 'M'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">
                {user?.name ? `${user.name}'s Workspace` : 'My Workspace'}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">FREE PLAN · OWNER</p>
            </div>
          )}
          {!collapsed && <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3 flex-shrink-0">
        <Link
          href="/dashboard/chat"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 text-xs"
        >
          <Plus size={15} />
          {!collapsed && <span>New Chat</span>}
        </Link>
      </div>

      {/* Workflow Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={15} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: Usage + User Profile */}
      <div className="px-3 pb-4 space-y-2 flex-shrink-0 border-t border-sidebar-border/60 pt-3">
        {/* Real Usage indicator */}
        {!collapsed && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300">AI Queries</span>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                Free
              </span>
            </div>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              <span className="font-bold text-white">{usedQueries}</span> / {limitQueries} used
            </p>
          </div>
        )}

        {/* User Account */}
        <div className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-900/60 transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name ? user.name[0]?.toUpperCase() : <User size={14} />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col bg-[#080B11] border-r border-slate-800/80 flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-md text-white"
      >
        <Menu size={18} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-60 bg-[#080B11] border-r border-slate-800"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
