'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Layout,
  Plus,
  Settings,
  Trash2,
  GripVertical,
  Maximize2,
  RefreshCw,
  MoreHorizontal,
  Grid,
  List,
  Save,
  Share2,
  Download,
  Clock,
  Filter,
  X,
  Edit2,
  Copy,
  Move,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface Dashboard {
  id: string
  name: string
  description?: string
  layout: DashboardLayout
  widgets: DashboardWidget[]
  refreshInterval?: number
  createdAt: string
  updatedAt: string
}

interface DashboardLayout {
  columns: number
  rowHeight: number
  gap: number
}

interface DashboardWidget {
  id: string
  type: 'visualization' | 'kpi' | 'text' | 'image' | 'divider'
  title?: string
  visualizationId?: string
  position: WidgetPosition
  size: WidgetSize
  config: WidgetConfig
  refreshInterval?: number
}

interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
}

interface WidgetSize {
  width: number
  height: number
}

interface WidgetConfig {
  visualizationId?: string
  visualizationName?: string
  chartType?: string
  databaseId?: string
  query?: string
  metrics?: KPIMetric[]
  content?: string
  imageUrl?: string
  borderColor?: string
  backgroundColor?: string
}

interface KPIMetric {
  label: string
  value: string | number
  change?: number
  format?: 'number' | 'currency' | 'percent'
}

interface SavedDashboard {
  id: string
  name: string
  description?: string
  widgetCount: number
  createdAt: string
}

// ============================================
// CONSTANTS
// ============================================

const GRID_COLUMNS = 12
const ROW_HEIGHT = 80
const DEFAULT_GAP = 16

const WIDGET_TYPES = [
  { id: 'visualization', label: 'Chart', icon: Grid },
  { id: 'kpi', label: 'KPI Card', icon: List },
  { id: 'text', label: 'Text', icon: Edit2 },
  { id: 'divider', label: 'Divider', icon: Minus },
]

// ============================================
// DASHBOARD BUILDER COMPONENT
// ============================================

interface DashboardBuilderProps {
  dashboardId?: string
  onSave?: (dashboard: Dashboard) => void
  onClose?: () => void
  readOnly?: boolean
}

export function DashboardBuilder({
  dashboardId,
  onSave,
  onClose,
  readOnly = false
}: DashboardBuilderProps) {
  // State
  const [dashboard, setDashboard] = useState<Dashboard>({
    id: dashboardId || '',
    name: 'New Dashboard',
    description: '',
    layout: { columns: GRID_COLUMNS, rowHeight: ROW_HEIGHT, gap: DEFAULT_GAP },
    widgets: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([])
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showWidgetPanel, setShowWidgetPanel] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Fetch saved dashboards
  useEffect(() => {
    fetchDashboards()
  }, [])

  // Load dashboard if editing
  useEffect(() => {
    if (dashboardId) {
      loadDashboard(dashboardId)
    }
  }, [dashboardId])

  // Auto-refresh
  useEffect(() => {
    if (dashboard.refreshInterval && dashboard.refreshInterval > 0) {
      const interval = setInterval(() => {
        refreshWidgets()
      }, dashboard.refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [dashboard.refreshInterval, dashboard.widgets])

  // ============================================
  // DATA FETCHING
  // ============================================

  async function fetchDashboards() {
    try {
      const res = await fetch('/api/dashboards')
      if (res.ok) {
        const data = await res.json()
        setSavedDashboards(data.dashboards || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboards:', err)
    }
  }

  async function loadDashboard(id: string) {
    try {
      const res = await fetch(`/api/dashboards/${id}`)
      if (res.ok) {
        const data = await res.json()
        setDashboard(data.dashboard)
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    }
  }

  async function saveDashboard() {
    setIsSaving(true)
    try {
      const method = dashboard.id ? 'PUT' : 'POST'
      const url = dashboard.id ? `/api/dashboards/${dashboard.id}` : '/api/dashboards'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboard),
      })

      if (res.ok) {
        const data = await res.json()
        setDashboard(data.dashboard)
        toast.success('Dashboard saved')
        fetchDashboards()
        onSave?.(data.dashboard)
      } else {
        throw new Error('Save failed')
      }
    } catch (err) {
      toast.error('Failed to save dashboard')
    } finally {
      setIsSaving(false)
    }
  }

  function refreshWidgets() {
    setLastRefresh(new Date())
  }

  // ============================================
  // WIDGET MANAGEMENT
  // ============================================

  function addWidget(type: DashboardWidget['type']) {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: type === 'kpi' ? 'New KPI' : 'New Widget',
      position: { x: 0, y: 0, w: 4, h: 3 },
      size: { width: 400, height: 240 },
      config: getDefaultConfig(type),
    }

    setDashboard(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }))
    setSelectedWidget(newWidget.id)
    setShowWidgetPanel(false)
  }

  function getDefaultConfig(type: DashboardWidget['type']): WidgetConfig {
    switch (type) {
      case 'kpi':
        return {
          metrics: [{ label: 'Value', value: 0 }],
        }
      case 'text':
        return { content: 'Enter text here...' }
      default:
        return {}
    }
  }

  function updateWidget(id: string, updates: Partial<DashboardWidget>) {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => w.id === id ? { ...w, ...updates } : w),
    }))
  }

  function deleteWidget(id: string) {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== id),
    }))
    if (selectedWidget === id) {
      setSelectedWidget(null)
    }
  }

  function duplicateWidget(id: string) {
    const widget = dashboard.widgets.find(w => w.id === id)
    if (widget) {
      const newWidget = {
        ...widget,
        id: `widget-${Date.now()}`,
        position: { ...widget.position, x: widget.position.x + 1 },
      }
      setDashboard(prev => ({
        ...prev,
        widgets: [...prev.widgets, newWidget],
      }))
    }
  }

  // ============================================
  // GRID LAYOUT
  // ============================================

  function getWidgetStyle(widget: DashboardWidget) {
    const { position, size } = widget
    return {
      gridColumn: `${position.x + 1} / span ${position.w}`,
      gridRow: `${position.y + 1} / span ${position.h}`,
      minHeight: `${position.h * ROW_HEIGHT}px`,
    }
  }

  function moveWidget(id: string, direction: 'up' | 'down' | 'left' | 'right') {
    const widget = dashboard.widgets.find(w => w.id === id)
    if (!widget) return

    const step = 1
    let newX = widget.position.x
    let newY = widget.position.y

    switch (direction) {
      case 'up': newY = Math.max(0, newY - step); break
      case 'down': newY += step; break
      case 'left': newX = Math.max(0, newX - step); break
      case 'right': newX += step; break
    }

    updateWidget(id, {
      position: { ...widget.position, x: newX, y: newY },
    })
  }

  function resizeWidget(id: string, w: number, h: number) {
    const widget = dashboard.widgets.find(w => w.id === id)
    if (!widget) return

    updateWidget(id, {
      position: { ...widget.position, w, h },
      size: { width: w * 100, height: h * ROW_HEIGHT },
    })
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <Layout className="w-5 h-5 text-primary" />
          {readOnly ? (
            <h1 className="text-lg font-semibold">{dashboard.name}</h1>
          ) : (
            <input
              type="text"
              value={dashboard.name}
              onChange={e => setDashboard(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-semibold bg-transparent border-none outline-none focus:underline"
            />
          )}
          {lastRefresh && (
            <span className="text-xs text-muted-foreground">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <button
                onClick={() => setShowWidgetPanel(!showWidgetPanel)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add Widget
              </button>
              <button
                onClick={saveDashboard}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
          <button
            onClick={refreshWidgets}
            className="p-2 hover:bg-muted rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-muted rounded-lg"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dashboard Grid */}
        <div className="flex-1 p-6 overflow-auto">
          {dashboard.widgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Layout className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                No widgets yet. Add your first widget to get started.
              </p>
              {!readOnly && (
                <button
                  onClick={() => setShowWidgetPanel(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Widget
                </button>
              )}
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${dashboard.layout.columns}, 1fr)`,
                gridAutoRows: `${dashboard.layout.rowHeight}px`,
              }}
            >
              {dashboard.widgets.map(widget => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  isSelected={selectedWidget === widget.id}
                  isReadOnly={readOnly}
                  onSelect={() => setSelectedWidget(widget.id)}
                  onDelete={() => deleteWidget(widget.id)}
                  onDuplicate={() => duplicateWidget(widget.id)}
                  onUpdate={(updates) => updateWidget(widget.id, updates)}
                  onMove={(dir) => moveWidget(widget.id, dir)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Widget Panel */}
        {showWidgetPanel && !readOnly && (
          <div className="w-64 border-l bg-card p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Add Widget</h3>
              <button onClick={() => setShowWidgetPanel(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {WIDGET_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => addWidget(type.id as DashboardWidget['type'])}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm border rounded-lg hover:bg-muted"
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Widget Settings */}
        {selectedWidget && (
          <WidgetSettingsPanel
            widget={dashboard.widgets.find(w => w.id === selectedWidget)!}
            onUpdate={(updates) => updateWidget(selectedWidget, updates)}
            onClose={() => setSelectedWidget(null)}
            isReadOnly={readOnly}
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// WIDGET CARD
// ============================================

interface WidgetCardProps {
  widget: DashboardWidget
  isSelected: boolean
  isReadOnly: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate: (updates: Partial<DashboardWidget>) => void
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void
}

function WidgetCard({
  widget,
  isSelected,
  isReadOnly,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  onMove,
}: WidgetCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className={cn(
        'relative bg-card border rounded-xl overflow-hidden transition-all',
        isSelected ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <span className="text-sm font-medium truncate">{widget.title || 'Widget'}</span>
        {!isReadOnly && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onMove('up'); }}
              className="p-1 hover:bg-muted rounded"
            >
              <Move className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 hover:bg-muted rounded"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 h-[calc(100%-44px)] overflow-auto">
        {widget.type === 'kpi' && <KPIContent widget={widget} />}
        {widget.type === 'visualization' && <VisualizationContent widget={widget} />}
        {widget.type === 'text' && <TextContent widget={widget} onUpdate={onUpdate} isReadOnly={isReadOnly} />}
        {widget.type === 'divider' && <DividerContent widget={widget} onUpdate={onUpdate} isReadOnly={isReadOnly} />}
      </div>

      {/* Menu */}
      {showMenu && !isReadOnly && (
        <div className="absolute top-10 right-2 z-10 bg-popover border rounded-lg shadow-lg p-1 min-w-[120px]">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); setShowMenu(false); }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded"
          >
            <Copy className="w-3 h-3" /> Duplicate
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded text-destructive"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// WIDGET CONTENT COMPONENTS
// ============================================

function KPIContent({ widget }: { widget: DashboardWidget }) {
  const metrics = widget.config.metrics || []

  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      {metrics.map((metric, i) => (
        <div key={i} className="flex flex-col justify-center">
          <span className="text-xs text-muted-foreground">{metric.label}</span>
          <span className="text-2xl font-bold">
            {typeof metric.value === 'number'
              ? metric.format === 'currency'
                ? `$${metric.value.toLocaleString()}`
                : metric.format === 'percent'
                ? `${metric.value.toFixed(1)}%`
                : metric.value.toLocaleString()
              : metric.value}
          </span>
          {metric.change !== undefined && (
            <span className={cn(
              'text-xs',
              metric.change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change).toFixed(1)}%
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function VisualizationContent({ widget }: { widget: DashboardWidget }) {
  if (!widget.config.visualizationId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No visualization selected
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      Visualization: {widget.config.visualizationName || 'Loading...'}
    </div>
  )
}

function TextContent({ widget, onUpdate, isReadOnly }: { widget: DashboardWidget; onUpdate: (u: Partial<DashboardWidget>) => void; isReadOnly: boolean }) {
  return (
    <div className={cn('text-sm', isReadOnly ? '' : 'cursor-text')}>
      {isReadOnly ? (
        <p className="whitespace-pre-wrap">{widget.config.content}</p>
      ) : (
        <textarea
          value={widget.config.content || ''}
          onChange={(e) => onUpdate({ config: { ...widget.config, content: e.target.value } })}
          className="w-full h-full bg-transparent border-none outline-none resize-none"
          placeholder="Enter text..."
        />
      )}
    </div>
  )
}

function DividerContent({ widget, onUpdate, isReadOnly }: { widget: DashboardWidget; onUpdate: (u: Partial<DashboardWidget>) => void; isReadOnly: boolean }) {
  return (
    <hr
      className="border-0 h-px w-full"
      style={{ backgroundColor: widget.config.borderColor || '#e5e7eb' }}
    />
  )
}

// ============================================
// WIDGET SETTINGS PANEL
// ============================================

interface WidgetSettingsPanelProps {
  widget: DashboardWidget
  onUpdate: (updates: Partial<DashboardWidget>) => void
  onClose: () => void
  isReadOnly: boolean
}

function WidgetSettingsPanel({ widget, onUpdate, onClose, isReadOnly }: WidgetSettingsPanelProps) {
  return (
    <div className="w-72 border-l bg-card p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Widget Settings</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase">Title</label>
          <input
            type="text"
            value={widget.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
            disabled={isReadOnly}
          />
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Width</label>
            <input
              type="number"
              value={widget.position.w}
              onChange={(e) => onUpdate({ position: { ...widget.position, w: parseInt(e.target.value) || 4 } })}
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              min={1}
              max={12}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">Height</label>
            <input
              type="number"
              value={widget.position.h}
              onChange={(e) => onUpdate({ position: { ...widget.position, h: parseInt(e.target.value) || 3 } })}
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              min={1}
              max={20}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Refresh Interval */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase">Auto Refresh</label>
          <select
            value={widget.refreshInterval || 0}
            onChange={(e) => onUpdate({ refreshInterval: parseInt(e.target.value) })}
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
            disabled={isReadOnly}
          >
            <option value={0}>Off</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={300}>5 minutes</option>
            <option value={900}>15 minutes</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function Minus({ className }: { className?: string }) {
  return <div className={cn('w-4 h-4', className)} style={{ background: 'currentColor' }} />
}

export type { Dashboard, DashboardWidget, DashboardLayout }
