'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MessageSquare, BarChart3, Database, BookOpen, Activity, CreditCard,
  Settings, ChevronDown, ChevronRight, Plus, User, LogOut, Sparkles,
  Layers, Code2, Key, Webhook, Menu, X, Command, PanelLeft
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { motion, AnimatePresence } from 'framer-motion'
import { CommandPalette } from '@/components/dashboard/command-palette'
import { WorkspaceSwitcher } from '@/components/dashboard/workspace-switcher'

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
      { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
      { href: '/dashboard/visualizer', icon: BarChart3, label: 'Data Visualizer' },
      { href: '/dashboard/dashboards', icon: Layers, label: 'Dashboards' },
      { href: '/dashboard/queries', icon: BarChart3, label: 'Saved Queries' },
    ],
  },
  {
    title: 'DATA',
    items: [
      { href: '/dashboard/databases', icon: Database, label: 'Databases' },
      { href: '/dashboard/knowledge', icon: BookOpen, label: 'Knowledge' },
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

  // Fetch real usage
  const { data: usageData } = useQuery({
    queryKey: ['sidebarUsage'],
    queryFn: async () => {
      const res = await fetch('/api/usage')
      if (!res.ok) return { used: 0, limit: 100 }
      const data = await res.json()
      const used = data.metrics?.AI_QUERY ?? data.metrics?.ai_queries ?? 0
      return { used, limit: 100 }
    },
    refetchInterval: 10000,
  })

  const usedQueries = usageData?.used ?? 0
  const limitQueries = usageData?.limit ?? 100
  const usagePercentage = Math.min(Math.round((usedQueries / limitQueries) * 100), 100)

  // Fetch real subscription plan
  const { data: billingData } = useQuery({
    queryKey: ['sidebarPlan'],
    queryFn: async () => {
      const res = await fetch('/api/billing')
      if (!res.ok) return { planName: 'Free', planSlug: 'free' }
      const data = await res.json()
      const planName = data?.subscription?.plan?.name ?? 'Free'
      const planSlug = data?.subscription?.plan?.slug ?? 'free'
      return { planName, planSlug }
    },
    staleTime: 60000,
  })

  const planName = billingData?.planName ?? 'Free'
  const planSlug = billingData?.planSlug ?? 'free'

  const planBadgeColor =
    planSlug === 'pro' || planSlug === 'business'
      ? 'text-indigo-400'
      : planSlug === 'starter'
      ? 'text-emerald-400'
      : 'text-slate-500'

  const sidebarContent = (
    <div className="flex flex-col h-full font-sans text-xs select-none bg-white border-r border-slate-200">
      {/* Brand & Workspace Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight text-slate-900 font-sans">
            INTERN<span className="text-indigo-600">ITE</span>
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-slate-400 hover:text-slate-700 transition-colors p-1"
          title="Toggle Sidebar"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft size={15} />
        </button>
      </div>

      <div className="p-2.5 border-b border-slate-200 shrink-0">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      {/* New Chat CTA */}
      <div className="p-2.5 shrink-0">
        <Link
          href="/dashboard/chat"
          aria-label="Start a new conversation"
            className="w-full flex items-center justify-center gap-2 bg-[#1d1d1f] hover:bg-black text-white font-semibold py-2.5 px-3 rounded-lg transition-all text-xs"
        >
          <Plus size={15} />
          {!collapsed && <span>New Conversation</span>}
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-2 mb-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
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
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={15} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: Usage + User */}
      <div className="px-2.5 pb-3 pt-2 space-y-2 shrink-0 border-t border-slate-200">
        {/* Real Usage Meter */}
        {!collapsed && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-slate-700">AI Queries</span>
              <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200">
                {planName.toUpperCase()}
              </span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              <span className="font-bold text-slate-900">{usedQueries}</span> / {limitQueries} queries
            </p>
          </div>
        )}

        {/* User Account */}
        <div className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name ? user.name[0]?.toUpperCase() : <User size={13} />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <CommandPalette />
      <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-200 shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 bg-white border border-slate-200 rounded-xl p-2 text-slate-700 shadow-md"
      >
        <Menu size={16} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-60 bg-white border-r border-slate-200"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
