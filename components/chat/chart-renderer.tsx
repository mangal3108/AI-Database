'use client'

import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { AiResponse } from '@/lib/zod-schemas'

interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTimeMs: number
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

interface ChartRendererProps {
  data: QueryResult
  visualization: NonNullable<AiResponse['visualization']>
}

export function ChartRenderer({ data, visualization }: ChartRendererProps) {
  const { type, xAxis, yAxis, title } = visualization

  if (data.rows.length === 0) return null

  const chartData = data.rows.slice(0, 100).map(row => {
    const mapped: Record<string, unknown> = {}
    for (const col of data.columns) {
      const val = row[col]
      mapped[col] = typeof val === 'bigint' ? Number(val) : val
    }
    return mapped
  })

  const xKey = xAxis ?? data.columns[0] ?? ''
  const yKey = yAxis ?? data.columns[1] ?? ''

  if (type === 'kpi' && data.rows.length === 1) {
    const value = data.rows[0]?.[yKey] ?? data.rows[0]?.[data.columns[0] ?? '']
    return (
      <div className="flex flex-col items-center py-6">
        {title && <p className="text-sm text-muted-foreground mb-2">{title}</p>}
        <p className="text-4xl font-bold text-foreground">{String(value ?? '—')}</p>
      </div>
    )
  }

  if (type === 'pie' || type === 'donut') {
    const labelKey = xKey || (data.columns[0] ?? '')
    const valueKey = yKey || (data.columns[1] ?? '')
    return (
      <div>
        {title && <p className="text-sm font-medium text-foreground mb-3 text-center">{title}</p>}
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey={valueKey}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              outerRadius={type === 'donut' ? 90 : 100}
              innerRadius={type === 'donut' ? 60 : 0}
              label={({ name, percent }: { name?: unknown; percent?: number }) => `${String(name ?? '').slice(0, 12)}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const ChartComponent = type === 'line' ? LineChart : type === 'area' ? AreaChart : BarChart

  return (
    <div>
      {title && <p className="text-sm font-medium text-foreground mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={220}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(v) => String(v).slice(0, 12)}
          />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />

          {type === 'bar' && (
            <Bar dataKey={yKey} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          )}
          {type === 'line' && (
            <Line type="monotone" dataKey={yKey} stroke={COLORS[0]} strokeWidth={2} dot={false} />
          )}
          {type === 'area' && (
            <Area type="monotone" dataKey={yKey} stroke={COLORS[0]} fill={`${COLORS[0]}20`} strokeWidth={2} />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
