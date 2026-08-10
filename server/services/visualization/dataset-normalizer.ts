/**
 * Dataset Normalizer - Internite AI
 *
 * Normalizes query results from any database type into a consistent format.
 */

import type { NormalizedDataset, ColumnMetadata, ColumnType, DatasetMetadata } from './types'

export type SupportedDatabase =
  | 'POSTGRESQL'
  | 'MYSQL'
  | 'MARIADB'
  | 'SQLSERVER'
  | 'SQLITE'
  | 'MONGODB'
  | 'NEON'
  | 'SUPABASE'
  | 'COCKROACHDB'

interface RawQueryResult {
  columns?: string[]
  rows?: Record<string, unknown>[]
  data?: unknown[]
  docs?: Record<string, unknown>[]
  results?: unknown[]
  [key: string]: unknown
}

interface NormalizeOptions {
  databaseId: string
  queryId?: string
  executionTimeMs: number
  databaseType: SupportedDatabase
}

/**
 * Detect column type from value
 */
export function detectColumnType(value: unknown): ColumnType {
  if (value === null || value === undefined) return 'unknown'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') {
    // Check for date patterns
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date'
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) return 'datetime'
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return 'time'
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'uuid'
    return 'string'
  }
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') {
    try {
      JSON.parse(JSON.stringify(value))
      return 'json'
    } catch {
      return 'unknown'
    }
  }
  return 'unknown'
}

/**
 * Normalize PostgreSQL/MySQL result
 */
function normalizeSQLResult(result: RawQueryResult, options: NormalizeOptions): NormalizedDataset {
  let columns: string[]
  let rows: Record<string, unknown>[]

  if (result.rows && result.rows.length > 0) {
    columns = Object.keys(result.rows[0])
    rows = result.rows
  } else if (result.columns && Array.isArray(result.columns)) {
    columns = result.columns as string[]
    rows = (result.data || []) as Record<string, unknown>[]
  } else if (Array.isArray(result.data) && result.data.length > 0) {
    const firstRow = result.data[0] as Record<string, unknown>
    columns = Object.keys(firstRow)
    rows = result.data as Record<string, unknown>[]
  } else {
    columns = []
    rows = []
  }

  const columnMetadata: ColumnMetadata[] = columns.map((name) => {
    const sampleValue = rows.length > 0 ? rows[0][name] : null
    return {
      name,
      type: detectColumnType(sampleValue),
      nullable: rows.some((r) => r[name] === null || r[name] === undefined),
    }
  })

  const metadata: DatasetMetadata = {
    databaseId: options.databaseId,
    queryId: options.queryId,
    executionTimeMs: options.executionTimeMs,
    rowCount: rows.length,
    columns: columnMetadata,
    databaseType: options.databaseType,
  }

  return { columns, rows, metadata }
}

/**
 * Normalize MongoDB aggregation result
 */
function normalizeMongoResult(result: RawQueryResult, options: NormalizeOptions): NormalizedDataset {
  let columns: string[] = []
  let rows: Record<string, unknown>[] = []

  if (result.docs && Array.isArray(result.docs)) {
    rows = result.docs as Record<string, unknown>[]
  } else if (result.results && Array.isArray(result.results)) {
    rows = result.results as Record<string, unknown>[]
  } else if (Array.isArray(result.data)) {
    rows = result.data as Record<string, unknown>[]
  } else if (Array.isArray(result)) {
    rows = result as Record<string, unknown>[]
  }

  if (rows.length > 0) {
    columns = [...new Set(rows.flatMap((r) => Object.keys(r)))]
  }

  const columnMetadata: ColumnMetadata[] = columns.map((name) => {
    const sampleValue = rows.length > 0 ? rows[0][name] : null
    return {
      name,
      type: detectColumnType(sampleValue),
      nullable: rows.some((r) => r[name] === null || r[name] === undefined),
    }
  })

  const metadata: DatasetMetadata = {
    databaseId: options.databaseId,
    queryId: options.queryId,
    executionTimeMs: options.executionTimeMs,
    rowCount: rows.length,
    columns: columnMetadata,
    databaseType: options.databaseType,
  }

  return { columns, rows, metadata }
}

/**
 * Main normalization function
 */
export function normalizeDataset(
  result: RawQueryResult,
  options: NormalizeOptions
): NormalizedDataset {
  // Handle MongoDB specially
  if (
    options.databaseType === 'MONGODB' ||
    result.docs ||
    result.results ||
    (!result.columns && !result.rows && Array.isArray(result.data))
  ) {
    return normalizeMongoResult(result, options)
  }

  return normalizeSQLResult(result, options)
}

/**
 * Limit dataset size for visualization
 */
export function limitDataset(dataset: NormalizedDataset, maxRows: number = 10000): NormalizedDataset {
  if (dataset.rows.length <= maxRows) {
    return dataset
  }

  return {
    ...dataset,
    rows: dataset.rows.slice(0, maxRows),
    metadata: {
      ...dataset.metadata,
      rowCount: maxRows,
    },
  }
}
