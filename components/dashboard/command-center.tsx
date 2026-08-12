'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Database,
  MessageSquare,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Plus,
  ArrowRight,
  Activity,
  Shield,
  Zap,
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Loader2,
  Eye,
  Calendar,
  Settings,
  Bell,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface DashboardMetrics {
  databases: number
  queries: number
  usagePercent: number
  visualizations: number
}

interface DatabaseHealth {
  id: string
  name: string
  type: string
  status: 'healthy' | 'warning' | 'error'
  latency: number
  lastSync: string
}

interface RecentActivity {
  id: string
  type: 'query' | 'visualization' | 'database' | 'billing' | 'api'
  description: string
  time: string
  icon: 'query' | 'visualization' | 'database' | 'billing' | 'api'
}

interface UsageBreakdown {
  label: string
  used: number
  limit: number
  unit: string
}

// ============================================
// CONSTANTS
// ============================================

const MOCK_METRICS: DashboardMetrics = {
  databases: 4,
  queries: 1842,
  usagePercent: 64,
  visualizations: 12,
}

const MOCK_DATABASES: DatabaseHealth[] = [
  { id: '1', name: 'Production PostgreSQL', type: 'PostgreSQL', status: 'healthy', latency: 12, lastSync: '2 min ago' },
  { id: '2', name: 'Analytics MongoDB', type: 'MongoDB', status: 'healthy', latency: 24, lastSync: '5 min ago' },
  { id: '3', name: 'CRM MySQL', type: 'MySQL', status: 'warning', latency: 89, lastSync: '15 min ago' },
]

const MOCK_ACTIVITIES: RecentActivity[] = [
  { id: '1', type: 'query', description: 'Executed: "Top 10 customers by revenue"', time: '12:42 PM', icon: 'query' },
  { id: '2', type: 'visualization', description: 'Created visualization "Monthly Revenue"', time: '12:38 PM', icon: 'visualization' },
  { id: '3', type: 'database', description: 'Schema sync completed for Production PG', time: '12:31 PM', icon: 'database' },
  { id: '4', type: 'api', description: 'API key created for production', time: '11:50 AM', icon: 'api' },
  { id: '5', type: 'billing', description: 'Plan upgraded to Pro', time: 'Yesterday', icon: 'billing' },
]

const MOCK_USAGE: UsageBreakdown[] = [
  { label: 'AI Queries', used: 642, limit: 1000, unit: 'queries' },
  { label: 'Storage', used: 320, limit: 1000, unit: 'MB' },
  { label: 'DB Connections', used: 4, limit: 10, unit: 'connections' },
]

const QUICK_ACTIONS = [
  { icon: Database, label: 'Connect DB', href: '/dashboard/databases/new', color: 'bg-blue-500' },
  { icon: MessageSquare, label: 'New Query', href: '/dashboard/chat', color: 'bg-purple-500' },
  { icon: BarChart3, label: 'Visualize', href: '/dashboard/visualizer', color: 'bg-orange-500' },
  { icon: Plus, label: 'Dashboard', href: '/dashboard/dashboards', color: 'bg-green-500' },
]

const AI_INSIGHTS = [
  { text: 'Revenue increased 12% this month compared to last month', trend: 'up' },
  { text: 'Customer churn decreased by 2.1% this week', trend: 'up' },
  { text: 'North region generated 38% of total sales', trend: 'neutral' },
]

// ============================================
// COMPONENT
// ============================================

export function CommandCenter() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(MOCK_METRICS)
  const [databases, setDatabases] = useState<DatabaseHealth[]>(MOCK_DATABASES)
  const [activities, setActivities] = useState<RecentActivity[]>(MOCK_ACTIVITIES)
  const [usage, setUsage] = useState<UsageBreakdown>(MOCK_USAGE[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [greeting, setGreeting] = useState('')

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  async function refreshData() {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
  }

  function getStatusColor(status: DatabaseHealth['status']) {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
    }
  }

  function getActivityIcon(icon: RecentActivity['icon']) {
    const icons = {
      query: MessageSquare,
      visualization: BarChart3,
      database: Database,
      billing: Zap,
      api: Shield,
    }
    const Icon = icons[icon]
    return <Icon className="w-4 h-4" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting}</h1>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening with your data</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          </button>
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', action.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">{action.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
            </Link>
          )
        })}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Database}
          label="Databases"
          value={metrics.databases}
          color="text-blue-400"
        />
        <MetricCard
          icon={MessageSquare}
          label="AI Queries"
          value={metrics.queries.toLocaleString()}
          color="text-purple-400"
        />
        <MetricCard
          icon={BarChart3}
          label="Visualizations"
          value={metrics.visualizations}
          color="text-orange-400"
        />
        <UsageCard used={metrics.usagePercent} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Database Health */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Database Health
            </h2>
            <Link href="/dashboard/databases" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {databases.map((db) => (
              <div key={db.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', db.status === 'healthy' ? 'bg-green-400' : db.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400')} />
                  <div>
                    <p className="text-sm font-medium text-white">{db.name}</p>
                    <p className="text-xs text-slate-500">{db.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-sm font-medium', getStatusColor(db.status))}>
                    {db.status === 'healthy' ? 'Healthy' : db.status === 'warning' ? 'Slow' : 'Error'}
                  </p>
                  <p className="text-xs text-slate-500">{db.latency}ms</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            AI Insights
          </h2>
          <div className="space-y-4">
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                  insight.trend === 'up' ? 'bg-green-500/20 text-green-400' : insight.trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'
                )}>
                  {insight.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : insight.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                </div>
                <p className="text-sm text-slate-300">{insight.text}</p>
              </div>
            ))}
          </div>
          <Link href="/dashboard/visualizer" className="mt-4 block text-sm text-indigo-400 hover:text-indigo-300">
            View all insights →
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent Activity
          </h2>
          <Link href="/dashboard/activity" className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                {getActivityIcon(activity.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-slate-500 shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function MetricCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('w-4 h-4', color)} />
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function UsageCard({ used }: { used: number }) {
  const color = used > 90 ? 'text-red-400' : used > 70 ? 'text-yellow-400' : 'text-green-400'

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-indigo-400" />
        <span className="text-xs text-slate-400 uppercase tracking-wider">Usage</span>
      </div>
      <p className={cn('text-2xl font-bold', color)}>{used}%</p>
      <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            used > 90 ? 'bg-red-500' : used > 70 ? 'bg-yellow-500' : 'bg-indigo-500'
          )}
          style={{ width: `${used}%` }}
        />
      </div>
    </div>
  )
}
