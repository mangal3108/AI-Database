'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  MessageSquare,
  Database,
  BookmarkCheck,
  LayoutDashboard,
  BookOpen,
  Settings,
  Plus,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Zap,
  User,
  BarChart3,
  TrendingUp,
} from 'lucide-react'
import type { Session } from 'next-auth'
import { WorkspaceSwitcher } from './workspace-switcher'

import { CreditCard, Activity, Code2, Key, Webhook } from 'lucide-react'

interface NavItem {
  href: string
  icon: any
  label: string
  exact?: boolean
  badge?: string
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { href: '/dashboard/chat', icon: MessageSquare, label: 'AI Chat', badge: 'Hero' },
      { href: '/dashboard/visualizer', icon: TrendingUp, label: 'Data Visualizer' },
      { href: '/dashboard/dashboards', icon: BarChart3, label: 'Dashboards' },
      { href: '/dashboard/queries', icon: BookmarkCheck, label: 'Saved Queries' },
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

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border flex-shrink-0">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight select-none font-sans">
              <span className="text-white">INTERN</span>
              <span className="text-[#60A5FA]">ITE</span>
            </span>
            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-primary/20 text-[#60A5FA] border border-[#60A5FA]/30">AI</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex items-center justify-center">
            <span className="font-bold text-sm tracking-tight select-none font-sans">
              <span className="text-white">I</span>
              <span className="text-[#60A5FA]">N</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-sidebar-foreground hover:text-foreground transition-colors p-1 rounded"
        >
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Workspace Switcher */}
      <WorkspaceSwitcher collapsed={collapsed} />

      {/* New Chat button */}
      <div className="p-3 flex-shrink-0">
        <Link
          href="/dashboard/chat"
          className={`flex items-center gap-2.5 bg-primary text-primary-foreground rounded-xl py-2.5 font-medium text-sm hover:opacity-90 transition-all ${
            collapsed ? 'justify-center px-2.5' : 'px-3'
          }`}
        >
          <Plus size={16} />
          {!collapsed && 'New Chat'}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {group.title && !collapsed && (
              <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon size={16} className="flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: Usage + User */}
      <div className="px-3 pb-4 space-y-2 flex-shrink-0">
        {/* Usage indicator */}
        {!collapsed && (
          <div className="bg-sidebar-accent rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-sidebar-accent-foreground">AI Queries</span>
              <span className="text-xs text-muted-foreground">Free</span>
            </div>
            <div className="h-1.5 bg-sidebar-border rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">0 / 100 used</p>
          </div>
        )}

        {/* User */}
        <div className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-sidebar-accent transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={14} className="text-primary" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
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
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar-background border-r border-sidebar-border flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-background border border-border rounded-xl p-2 shadow-md"
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
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-60 bg-sidebar-background border-r border-sidebar-border"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
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
