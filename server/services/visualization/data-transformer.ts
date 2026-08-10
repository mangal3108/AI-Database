/**
 * Data Transformer - Internite AI
 */

import type { NormalizedDataset, FilterConfig } from './types'

export function applyFilters(dataset: NormalizedDataset, filters: FilterConfig[]): NormalizedDataset {
  if (!filters || filters.length === 0) return dataset

  let filteredRows = [...dataset.rows]

  for (const filter of filters) {
    filteredRows = filteredRows.filter(row => {
      const value = row[filter.field]
      return evaluateFilter(value, filter)
    })
  }

  return {
    ...dataset,
    rows: filteredRows,
    metadata: {
      ...dataset.metadata,
      rowCount: filteredRows.length,
    },
  }
}

function evaluateFilter(value: unknown, filter: FilterConfig): boolean {
  if (value === null || value === undefined) return false

  switch (filter.operator) {
    case 'eq':
      return value === filter.value
    case 'ne':
      return value !== filter.value
    case 'gt':
      return typeof value === 'number' && value > Number(filter.value)
    case 'gte':
      return typeof value === 'number' && value >= Number(filter.value)
    case 'lt':
      return typeof value === 'number' && value < Number(filter.value)
    case 'lte':
      return typeof value === 'number' && value <= Number(filter.value)
    case 'contains':
      return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
    case 'in':
      return Array.isArray(filter.value) && filter.value.includes(value)
    default:
      return true
  }
}

export function transformForChart(dataset: NormalizedDataset, chartType: string): unknown {
  const { columns, rows } = dataset

  if (chartType === 'KPI' && columns.length >= 2) {
    const valueField = columns[1]
    const total = rows.reduce((sum, r) => sum + (Number(r[valueField]) || 0), 0)
    return { value: total, label: columns[0], unit: '' }
  }

  return { columns, rows }
}
