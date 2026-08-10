/**
 * Visualization Types - Internite AI
 */

// Chart Types
export type ChartType = 'KPI' | 'TABLE' | 'LINE' | 'BAR' | 'AREA' | 'PIE' | 'DONUT' | 'SCATTER'

export type SupportedDatabase = 'POSTGRESQL' | 'MYSQL' | 'MARIADB' | 'SQLSERVER' | 'SQLITE' | 'MONGODB' | 'NEON' | 'SUPABASE' | 'COCKROACHDB'

// Column Types
export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time' | 'uuid' | 'json' | 'array' | 'unknown'

// Column Metadata
export interface ColumnMetadata {
  name: string
  type: ColumnType
}

// Dataset
export interface DatasetMetadata {
  databaseId: string
  queryId?: string
  executionTimeMs: number
  rowCount: number
  columns: ColumnMetadata[]
  databaseType: SupportedDatabase
}

export interface NormalizedDataset {
  columns: string[]
  rows: Record<string, unknown>[]
  metadata: DatasetMetadata
}

// Filter
export interface FilterConfig {
  field: string
  operator: string
  value: unknown
  value2?: unknown
}

// Chart Recommendation
export interface ChartRecommendation {
  type: ChartType
  confidence: number
  reasoning: string
  suggestedConfig?: Record<string, unknown>
}

// Visualization Config
export interface VisualizationConfig {
  chartType: ChartType | string
  xAxis?: string
  yAxis?: string
  groupBy?: string
  showLegend?: boolean
  showGrid?: boolean
}
