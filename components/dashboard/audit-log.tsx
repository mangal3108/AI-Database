'use client'

import { useState } from 'react'
import {
  Activity,
  Clock,
  Database,
  MessageSquare,
  BarChart3,
  Key,
  CreditCard,
  Shield,
  User,
  ChevronRight,
  Filter,
  Download,
  Search,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

export interface AuditEvent {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId: string
  timestamp: Date
  ip: string
  status: 'success' | 'failed' | 'warning'
  metadata?: Record<string, unknown>
  userAgent?: string
}

type AuditFilter = 'all' | 'query' | 'database' | 'billing' | 'auth' | 'api'

// ============================================
// CONSTANTS
// ============================================

const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Mangal',
    userEmail: 'mangal@internite.ai',
    action: 'AI_QUERY_EXECUTED',
    resource: 'database_query',
    resourceId: 'q_abc123',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    ip: '192.168.1.100',
    status: 'success',
    metadata: { query: 'SELECT * FROM users LIMIT 10', rows: 10 },
  },
  {
    id: '2',
    userId: 'u1',
    userName: 'Mangal',
    userEmail: 'mangal@internite.ai',
    action: 'DATABASE_CONNECTED',
    resource: 'database',
    resourceId: 'db_xyz789',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    ip: '192.168.1.100',
    status: 'success',
    metadata: { databaseType: 'PostgreSQL', host: 'db.example.com' },
  },
  {
    id: '3',
    userId: 'u1',
    userName: 'Mangal',
    userEmail: 'mangal@internite.ai',
    action: 'VISUALIZATION_CREATED',
    resource: 'visualization',
    resourceId: 'vis_456',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    ip: '192.168.1.100',
    status: 'success',
    metadata: { name: 'Monthly Revenue', chartType: 'AREA' },
  },
  {
    id: '4',
    userId: 'u1',
    userName: 'Mangal',
    userEmail: 'mangal@internite.ai',
    action: 'API_KEY_CREATED',
    resource: 'api_key',
    resourceId: 'key_new',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    ip: '192.168.1.100',
    status: 'success',
  },
  {
    id: '5',
    userId: 'u1',
    userName: 'Mangal',
    userEmail: 'mangal@internite.ai',
    action: 'QUERY_BLOCKED',
    resource: 'database_query',
    resourceId: 'q_def456',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    ip: '192.168.1.100',
    status: 'warning',
    metadata: { query: 'DROP TABLE users', reason: 'Destructive query blocked' },
  },
  {
    id: '6',
    userId: 'u1',
    userName: 'Mangal',
    userEmail: 'mangal@internite.ai',
    action: 'PLAN_UPGRADED',
    resource: 'subscription',
    resourceId: 'sub_123',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    ip: '192.168.1.100',
    status: 'success',
    metadata: { fromPlan: 'FREE', toPlan: 'PRO' },
  },
  {
    id: '7',
    userId: 'u2',
    userName: 'Admin',
    userEmail: 'admin@internite.ai',
    action: 'USER_LOGIN',
    resource: 'auth',
    resourceId: 'session_abc',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
    ip: '10.0.0.1',
    status: 'success',
  },
]

// ============================================
// HELPERS
// ============================================

function getActionIcon(action: string) {
  if (action.includes('QUERY')) return MessageSquare
  if (action.includes('DATABASE')) return Database
  if (action.includes('VISUALIZATION') || action.includes('DASHBOARD')) return BarChart3
  if (action.includes('API_KEY') || action.includes('API')) return Key
  if (action.includes('BILLING') || action.includes('PLAN') || action.includes('PAYMENT')) return CreditCard
  if (action.includes('AUTH') || action.includes('LOGIN') || action.includes('USER')) return User
  return Shield
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    AI_QUERY_EXECUTED: 'Executed AI query',
    QUERY_BLOCKED: 'Blocked query',
    DATABASE_CONNECTED: 'Connected database',
    DATABASE_DISCONNECTED: 'Disconnected database',
    VISUALIZATION_CREATED: 'Created visualization',
    VISUALIZATION_DELETED: 'Deleted visualization',
    DASHBOARD_CREATED: 'Created dashboard',
    API_KEY_CREATED: 'Created API key',
    API_KEY_REVOKED: 'Revoked API key',
    PLAN_UPGRADED: 'Upgraded plan',
    PLAN_DOWNGRADED: 'Downgraded plan',
    USER_LOGIN: 'Logged in',
    USER_LOGOUT: 'Logged out',
    PAYMENT_FAILED: 'Payment failed',
    WEBHOOK_CREATED: 'Created webhook',
  }
  return labels[action] || action.replace(/_/g, ' ')
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusColor(status: AuditEvent['status']): string {
  switch (status) {
    case 'success': return 'text-green-400'
    case 'failed': return 'text-red-400'
    case 'warning': return 'text-yellow-400'
  }
}

// ============================================
// COMPONENT
// ============================================

export function AuditLog() {
  const [events, setEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS)
  const [filter, setFilter] = useState<AuditFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')

  const filteredEvents = events.filter(event => {
    // Filter by category
    if (filter !== 'all') {
      if (filter === 'query' && !event.action.includes('QUERY')) return false
      if (filter === 'database' && !event.action.includes('DATABASE')) return false
      if (filter === 'billing' && !event.action.includes('PLAN') && !event.action.includes('PAYMENT')) return false
      if (filter === 'auth' && !event.action.includes('USER') && !event.action.includes('AUTH')) return false
      if (filter === 'api' && !event.action.includes('API')) return false
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        event.action.toLowerCase().includes(query) ||
        event.userName.toLowerCase().includes(query) ||
        event.resource.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="bg-[#0D111A] border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-white">Audit Log</h2>
              <p className="text-xs text-slate-500">{filteredEvents.length} events</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'query', 'database', 'auth', 'api', 'billing'] as AuditFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Event List */}
      <div className="divide-y divide-slate-800/50">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No events found</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const Icon = getActionIcon(event.action)
            const isExpanded = expandedId === event.id

            return (
              <div
                key={event.id}
                className="p-4 hover:bg-slate-800/20 transition-colors cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    event.status === 'success' ? 'bg-green-500/10' :
                    event.status === 'warning' ? 'bg-yellow-500/10' :
                    'bg-red-500/10'
                  )}>
                    <Icon className={cn('w-4 h-4', getStatusColor(event.status))} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{getActionLabel(event.action)}</span>
                      <span className={cn('text-xs px-1.5 py-0.5 rounded',
                        event.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        event.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      )}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>{event.userName}</span>
                      <span>•</span>
                      <span>{formatTime(event.timestamp)}</span>
                      <span>•</span>
                      <span className="font-mono">{event.ip}</span>
                    </div>

                    {isExpanded && event.metadata && (
                      <div className="mt-3 p-3 bg-slate-900/50 rounded-lg font-mono text-xs text-slate-400">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <ChevronRight className={cn(
                    'w-4 h-4 text-slate-600 transition-transform shrink-0 mt-1',
                    isExpanded && 'rotate-90'
                  )} />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-500">Showing {filteredEvents.length} of {events.length}</p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 rounded-lg" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 rounded-lg" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
