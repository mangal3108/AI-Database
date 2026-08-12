'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  TrendingUp,
  Download,
  Save,
  RefreshCw,
  Loader2,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Plus,
  Database,
  X,
  Trash2,
  Share2,
  Filter,
  ArrowUpDown,
  Circle,
  LayoutGrid,
  TrendingDown,
  Activity,
  Send,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Eye,
  Settings2,
  RotateCcw,
  DownloadCloud,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  LineChart as RechartsLine,
  BarChart as RechartsBar,
  AreaChart as RechartsArea,
  PieChart as RechartsPie,
  Line,
  Bar,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// ============================================
// TYPES
// ============================================

type ChartType = 'LINE' | 'BAR' | 'AREA' | 'PIE' | 'DONUT' | 'SCATTER' | 'KPI' | 'TABLE'

interface Database {
  id: string
  name: string
  type: string
}

interface TableInfo {
  name: string
  columns: string[]
}

interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTimeMs: number
}

interface ChartConfig {
  xAxis: string
  yAxis: string[]
  aggregation: string
  sort: 'asc' | 'desc'
  limit: number
}

interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
  logic: 'AND' | 'OR'
}

interface AIInsight {
  summary: string
  observations: string[]
  trend?: string
}

// ============================================
// CONSTANTS
// ============================================

const CHART_TYPES: { id: ChartType; label: string; icon: typeof LineChart }[] = [
  { id: 'LINE', label: 'Line', icon: LineChart },
  { id: 'BAR', label: 'Bar', icon: BarChart3 },
  { id: 'AREA', label: 'Area', icon: TrendingUp },
  { id: 'PIE', label: 'Pie', icon: PieChart },
  { id: 'DONUT', label: 'Donut', icon: Circle },
  { id: 'SCATTER', label: 'Scatter', icon: LayoutGrid },
  { id: 'KPI', label: 'KPI', icon: Sparkles },
  { id: 'TABLE', label: 'Table', icon: Table2 },
]

const AGGREGATIONS = [
  { value: 'SUM', label: 'Sum' },
  { value: 'AVG', label: 'Average' },
  { value: 'COUNT', label: 'Count' },
  { value: 'MIN', label: 'Min' },
  { value: 'MAX', label: 'Max' },
]

const OPERATORS = [
  { value: 'eq', label: 'equals' },
  { value: 'ne', label: 'not equals' },
  { value: 'gt', label: 'greater than' },
  { value: 'gte', label: 'greater or equal' },
  { value: 'lt', label: 'less than' },
  { value: 'lte', label: 'less or equal' },
  { value: 'contains', label: 'contains' },
  { value: 'in', label: 'in list' },
]

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#06b6d4', '#84cc16', '#f43f5e']

// ============================================
// COMPONENT
// ============================================

interface VisualizerWorkspaceProps {
  userId: string
  initialDatabases?: Database[]
}

export function VisualizerWorkspace({ userId, initialDatabases = [] }: VisualizerWorkspaceProps) {
  // State
  const [databases, setDatabases] = useState<Database[]>(initialDatabases)
  const [selectedDatabase, setSelectedDatabase] = useState<string>(initialDatabases[0]?.id ?? '')
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')

  const [query, setQuery] = useState<string>('')
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const [chartType, setChartType] = useState<ChartType>('BAR')
  const [config, setConfig] = useState<ChartConfig>({
    xAxis: '',
    yAxis: [],
    aggregation: 'SUM',
    sort: 'desc',
    limit: 100,
  })

  const [filters, setFilters] = useState<FilterCondition[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [insight, setInsight] = useState<AIInsight | null>(null)
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
  const [showInsight, setShowInsight] = useState(false)
  const [showLeftPanel, setShowLeftPanel] = useState(true)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [visualizationName, setVisualizationName] = useState('')

  const tableColumns = tables.find(table => table.name === selectedTable)?.columns ?? []

  // ============================================
  // EFFECTS
  // ============================================

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchDatabases = useCallback(async () => {
    try {
      const res = await fetch('/api/databases')
      if (res.ok) {
        const data = await res.json()
        const available = (data.connections || data.databases || []) as Database[]
        if (available.length > 0) {
          setDatabases(available)
          setSelectedDatabase(current => current || available[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch databases:', err)
    }
  }, [])

  const fetchTables = useCallback(async (databaseId: string) => {
    try {
      const res = await fetch(`/api/databases/${databaseId}/schema`)
      if (res.ok) {
        const data = await res.json()
        const tableList: TableInfo[] = (data.tables || data.schemas?.flatMap((s: { tables: TableInfo[] }) => s.tables) || [])
          .map((t: TableInfo | string) => typeof t === 'string'
            ? { name: t, columns: [] }
            : {
                name: t.name,
                columns: Array.isArray(t.columns)
                  ? t.columns.map((c) => typeof c === 'string' ? c : (c as { name: string }).name)
                  : [],
              })
        setTables(tableList)
      }
    } catch (err) {
      console.error('Failed to fetch tables:', err)
    }
  }, [])

  useEffect(() => {
    // This effect intentionally hydrates client state from the API on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDatabases()
  }, [fetchDatabases])

  useEffect(() => {
    if (!selectedDatabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTables([])
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTable('')
      return
    }

    void fetchTables(selectedDatabase)
  }, [fetchTables, selectedDatabase])

  async function executeQuery() {
    if (!selectedDatabase) {
      toast.error('Please select a database')
      return
    }

    if (!query.trim() && !naturalLanguageQuery.trim()) {
      toast.error('Please enter a query or describe what you want to see')
      return
    }

    setIsLoading(true)
    setError(null)
    setInsight(null)
    setShowInsight(false)

    try {
      const requestBody: Record<string, unknown> = {
        databaseId: selectedDatabase,
        chartType,
        filters,
      }

      if (query.trim()) {
        requestBody.query = query
      } else {
        requestBody.naturalLanguageQuery = naturalLanguageQuery
      }

      const res = await fetch('/api/visualizations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Query failed')
      }

      setResult({
        columns: data.dataset?.columns || [],
        rows: data.dataset?.rows || [],
        rowCount: data.dataset?.rows?.length || 0,
        executionTimeMs: data.dataset?.metadata?.executionTimeMs || 0,
      })

      if (data.recommendation) {
        setChartType(data.recommendation.type as ChartType)
      }

      if (data.dataset?.columns?.length >= 2) {
        const numericCols = data.dataset.columns.filter((col: string) => {
          const sample = data.dataset.rows?.[0]?.[col]
          return typeof sample === 'number'
        })
        if (numericCols.length > 0) {
          setConfig(prev => ({
            ...prev,
            xAxis: data.dataset.columns[0],
            yAxis: [numericCols[0]],
          }))
        }
      }

      setLastUpdated(new Date())
      toast.success(`Query returned ${data.dataset?.rows?.length || 0} rows`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Query failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function generateInsight() {
    if (!result) return

    setIsGeneratingInsight(true)
    try {
      const res = await fetch('/api/visualizations/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset: result }),
      })

      if (res.ok) {
        const data = await res.json()
        setInsight({
          summary: data.summary,
          observations: data.observations || [],
          trend: data.trends?.[0]?.direction,
        })
        setShowInsight(true)
      }
    } catch {
      toast.error('Failed to generate insight')
    } finally {
      setIsGeneratingInsight(false)
    }
  }

  async function saveVisualization() {
    if (!visualizationName.trim()) {
      toast.error('Please enter a name')
      return
    }

    try {
      const res = await fetch('/api/visualizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visualizationName,
          databaseId: selectedDatabase,
          chartType,
          configuration: { config, filters },
          sourceQuery: query || naturalLanguageQuery,
        }),
      })

      if (res.ok) {
        toast.success('Visualization saved')
        setShowSaveModal(false)
        setVisualizationName('')
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      toast.error('Failed to save visualization')
    }
  }

  async function exportData(format: 'CSV' | 'JSON') {
    if (!result) return

    try {
      const res = await fetch('/api/visualizations/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset: result, format }),
      })

      if ((format === 'CSV' || format === 'JSON') && res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${visualizationName || 'export'}.${format.toLowerCase()}`
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`${format} downloaded`)
      }
    } catch {
      toast.error('Export failed')
    }
  }

  // ============================================
  // DATA TRANSFORMATION
  // ============================================

  function getChartData() {
    if (!result || !config.xAxis) return []

    const processedRows = [...result.rows]

    // Apply aggregation
    if (config.yAxis.length > 0) {
      const grouped: Record<string, Record<string, number>> = {}
      processedRows.forEach(row => {
        const xVal = String(row[config.xAxis] || 'Unknown')
        if (!grouped[xVal]) grouped[xVal] = {}
        config.yAxis.forEach(y => {
          const val = Number(row[y]) || 0
          if (config.aggregation === 'SUM' || !config.aggregation) {
            grouped[xVal][y] = (grouped[xVal][y] || 0) + val
          } else if (config.aggregation === 'AVG') {
            if (!grouped[xVal][y]) grouped[xVal][y] = val
            else grouped[xVal][y] = (grouped[xVal][y] + val) / 2
          } else if (config.aggregation === 'COUNT') {
            grouped[xVal][y] = (grouped[xVal][y] || 0) + 1
          } else if (config.aggregation === 'MAX') {
            grouped[xVal][y] = Math.max(grouped[xVal][y] || -Infinity, val)
          } else if (config.aggregation === 'MIN') {
            grouped[xVal][y] = Math.min(grouped[xVal][y] || Infinity, val)
          }
        })
      })

      const data: Record<string, unknown>[] = Object.entries(grouped).map(([name, values]) => ({
        name,
        ...(values as Record<string, number>),
      }))

      const firstMetric = config.yAxis[0]
      return data.sort((a, b) => {
        const difference = (Number((a as Record<string, unknown>)[firstMetric]) || 0) - (Number((b as Record<string, unknown>)[firstMetric]) || 0)
        return config.sort === 'desc' ? -difference : difference
      })
    }

    return processedRows.slice(0, config.limit)
  }

  function getKPIData() {
    if (!result || config.yAxis.length === 0) return null
    const y = config.yAxis[0]
    const values = result.rows.map(r => Number(r[y]) || 0)
    const total = values.reduce((a, b) => a + b, 0)
    return { value: total, label: y }
  }

  function getPieData() {
    if (!result || !config.xAxis || config.yAxis.length === 0) return []
    const y = config.yAxis[0]

    const grouped: Record<string, number> = {}
    result.rows.forEach(row => {
      const key = String(row[config.xAxis] || 'Unknown')
      grouped[key] = (grouped[key] || 0) + (Number(row[y]) || 0)
    })

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }

  // ============================================
  // RENDER HELPERS
  // ============================================

  function renderChart() {
    const data = getChartData()

    if (chartType === 'KPI') {
      const kpi = getKPIData()
      if (!kpi) return <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-7xl font-bold text-primary">{kpi.value.toLocaleString()}</div>
          <div className="text-xl text-muted-foreground mt-4">{kpi.label}</div>
        </div>
      )
    }

    if (chartType === 'TABLE') {
      return (
        <div className="overflow-auto h-full rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                {result?.columns.map(col => (
                  <th key={col} className="px-4 py-3 text-left font-semibold text-muted-foreground">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result?.rows.slice(0, 100).map((row, i) => (
                <tr key={i} className="border-t hover:bg-muted/30">
                  {result.columns.map(col => (
                    <td key={col} className="px-4 py-2.5">{String(row[col] ?? '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (chartType === 'PIE' || chartType === 'DONUT') {
      const pieData = getPieData()
      if (pieData.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>

      return (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={chartType === 'DONUT' ? '60%' : '0%'}
              outerRadius="80%"
              dataKey="value"
              label={({ name, percent }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'LINE') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLine data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yAxis.map((y, i) => (
              <Line key={y} type="monotone" dataKey={y} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 4 }} />
            ))}
          </RechartsLine>
        </ResponsiveContainer>
      )
    }

    if (chartType === 'AREA') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsArea data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yAxis.map((y, i) => (
              <Area key={y} type="monotone" dataKey={y} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.3} />
            ))}
          </RechartsArea>
        </ResponsiveContainer>
      )
    }

    // Default: BAR
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.yAxis.map((y, i) => (
            <Bar key={y} dataKey={y} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    )
  }

  function addFilter() {
    setFilters([
      ...filters,
      { id: crypto.randomUUID(), field: '', operator: 'eq', value: '', logic: 'AND' }
    ])
  }

  function removeFilter(id: string) {
    setFilters(filters.filter(f => f.id !== id))
  }

  function updateFilter(id: string, updates: Partial<FilterCondition>) {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="p-2 hover:bg-muted rounded-lg lg:hidden"
          >
            {showLeftPanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
          <h1 className="text-lg font-semibold">Data Visualizer</h1>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="w-4 h-4" />
            <select
              aria-label="Select visualizer database"
              value={selectedDatabase}
              onChange={e => { setSelectedDatabase(e.target.value); setSelectedTable(''); setTables([]) }}
              className="max-w-40 rounded-lg border bg-background px-2 py-1.5 text-sm text-foreground"
            >
              <option value="">Select database</option>
              {databases.map(db => <option key={db.id} value={db.id}>{db.name}</option>)}
            </select>
          </label>
          {result && (
            <>
              <button
                onClick={() => setShowInsight(!showInsight)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted"
              >
                <Sparkles className="w-4 h-4" />
                Insights
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted">
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-card border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button onClick={() => exportData('CSV')} className="w-full px-3 py-2 text-sm text-left hover:bg-muted">Export CSV</button>
                  <button onClick={() => exportData('JSON')} className="w-full px-3 py-2 text-sm text-left hover:bg-muted">Export JSON</button>
                </div>
              </div>
            </>
          )}
          <button
            onClick={executeQuery}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isLoading ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Data Explorer */}
        {showLeftPanel && (
          <div className="w-64 shrink-0 border-r bg-card overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Database Selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Database</label>
                <select
                  value={selectedDatabase}
                  onChange={e => { setSelectedDatabase(e.target.value); setSelectedTable(''); setTables([]); }}
                  className="w-full mt-1.5 px-3 py-2 text-sm border rounded-lg bg-background"
                >
                  <option value="">Select database</option>
                  {databases.map(db => (
                    <option key={db.id} value={db.id}>{db.name}</option>
                  ))}
                </select>
              </div>

              {/* Tables */}
              {tables.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tables</label>
                  <div className="mt-1.5 space-y-1">
                    {tables.slice(0, 20).map(table => (
                      <button
                        key={table.name}
                        onClick={() => setSelectedTable(table.name)}
                        className={cn(
                          "w-full px-3 py-2 text-sm text-left rounded-lg transition-colors",
                          selectedTable === table.name ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        )}
                      >
                        <Database className="w-3 h-3 inline mr-2 text-muted-foreground" />
                        {table.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Columns */}
              {tableColumns.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Columns</label>
                  <div className="mt-1.5 space-y-1 max-h-64 overflow-y-auto">
                    {tableColumns.map(col => (
                      <button
                        key={col}
                        onClick={() => {
                          if (!config.yAxis.includes(col)) {
                            setConfig(prev => ({ ...prev, yAxis: [...prev.yAxis, col] }))
                          }
                        }}
                        className="w-full px-3 py-1.5 text-xs text-left rounded hover:bg-muted flex items-center justify-between"
                      >
                        <span className="truncate">{col}</span>
                        {config.yAxis.includes(col) && <span className="text-primary text-[10px]">Y</span>}
                        {config.xAxis === col && <span className="text-primary text-[10px]">X</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center - Chart Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/30">
            {CHART_TYPES.map(chart => (
              <button
                key={chart.id}
                onClick={() => setChartType(chart.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors",
                  chartType === chart.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
                title={chart.label}
              >
                <chart.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{chart.label}</span>
              </button>
            ))}
          </div>

          {/* Query Input */}
          <div className="px-4 py-3 border-b">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={naturalLanguageQuery}
                  onChange={e => setNaturalLanguageQuery(e.target.value)}
                  placeholder="Ask your data: Show monthly revenue by region..."
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background"
                  onKeyDown={e => e.key === 'Enter' && executeQuery()}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-3 py-2 text-sm border rounded-lg hover:bg-muted",
                  showFilters && "bg-muted"
                )}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Filters</span>
                  <button onClick={addFilter} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add filter
                  </button>
                </div>
                {filters.map((filter, index) => (
                  <div key={filter.id} className="flex items-center gap-2">
                    {index > 0 && (
                      <select
                        value={filter.logic}
                        onChange={e => updateFilter(filter.id, { logic: e.target.value as 'AND' | 'OR' })}
                        className="px-2 py-1 text-xs border rounded bg-background"
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    )}
                    <select
                      value={filter.field}
                      onChange={e => updateFilter(filter.id, { field: e.target.value })}
                      className="flex-1 px-2 py-1 text-xs border rounded bg-background"
                    >
                      <option value="">Field</option>
                      {result?.columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                    <select
                      value={filter.operator}
                      onChange={e => updateFilter(filter.id, { operator: e.target.value })}
                      className="px-2 py-1 text-xs border rounded bg-background"
                    >
                      {OPERATORS.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={filter.value}
                      onChange={e => updateFilter(filter.id, { value: e.target.value })}
                      placeholder="Value"
                      className="w-32 px-2 py-1 text-xs border rounded bg-background"
                    />
                    <button onClick={() => removeFilter(filter.id)} className="p-1 hover:bg-muted rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {filters.length === 0 && (
                  <p className="text-xs text-muted-foreground">No filters applied</p>
                )}
              </div>
            )}
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-6 overflow-auto">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <p className="text-destructive font-medium">{error}</p>
                <p className="text-sm text-muted-foreground mt-2">Please check your query and try again</p>
              </div>
            ) : result ? (
              <div className="h-full min-h-[400px]">
                {renderChart()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <BarChart3 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-2">Select a database and ask your data</p>
                <p className="text-sm text-muted-foreground">Try: "Show monthly revenue trends"</p>
              </div>
            )}
          </div>

          {/* AI Insight */}
          {showInsight && insight && (
            <div className="px-6 pb-4">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-medium">Analysis</span>
                </div>
                <p className="text-sm mb-3">{insight.summary}</p>
                {insight.observations?.length > 0 && (
                  <ul className="space-y-1.5">
                    {insight.observations.map((obs, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 mt-1 text-primary flex-shrink-0" />
                        {obs}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Result Info */}
          {result && (
            <div className="px-6 py-2 border-t bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{result.rowCount.toLocaleString()} rows</span>
                <span>{result.executionTimeMs}ms</span>
              </div>
              <button
                onClick={generateInsight}
                disabled={isGeneratingInsight}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                {isGeneratingInsight ? 'Analyzing...' : 'Get insight'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Save Visualization</h2>
              <button onClick={() => setShowSaveModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={visualizationName}
                  onChange={e => setVisualizationName(e.target.value)}
                  placeholder="Monthly Revenue"
                  className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-background"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-muted">
                  Cancel
                </button>
                <button onClick={saveVisualization} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
