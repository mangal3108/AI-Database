/**
 * Enhanced Chart Recommendation Engine - Internite AI
 *
 * Uses scoring system to recommend optimal chart types based on data structure.
 * Includes anomaly detection and trend analysis.
 */

import type { NormalizedDataset } from './types'

// ============================================
// TYPES
// ============================================

export interface ChartScore {
  chartType: string
  score: number
  confidence: number
  reasoning: string
}

export interface DataStatistics {
  totalRows: number
  numericFields: FieldStats[]
  temporalFields: string[]
  categoricalFields: CategoricalField[]
  hasDateAxis: boolean
  hasMultipleSeries: boolean
}

export interface FieldStats {
  name: string
  min: number
  max: number
  avg: number
  median: number
  stdDev: number
  nullCount: number
  cardinality: number
}

export interface CategoricalField {
  name: string
  uniqueCount: number
  topValues: { value: string; count: number }[]
}

export interface AnomalyResult {
  field: string
  anomalies: Anomaly[]
  anomalyScore: number
}

export interface Anomaly {
  index: number
  value: number
  expected: number
  deviation: number
  type: 'high' | 'low' | 'unexpected'
}

export interface TrendResult {
  direction: 'increasing' | 'decreasing' | 'stable' | 'fluctuating'
  percentage: number
  seasonality?: {
    detected: boolean
    period?: number
  }
}

// ============================================
// CHART RECOMMENDATION
// ============================================

const CHART_TYPES = ['LINE', 'BAR', 'AREA', 'PIE', 'DONUT', 'SCATTER', 'KPI', 'TABLE']

export function analyzeDataset(dataset: NormalizedDataset): DataStatistics {
  const { columns, rows } = dataset

  const numericFields: FieldStats[] = []
  const temporalFields: string[] = []
  const categoricalFields: CategoricalField[] = []

  let hasDateAxis = false

  columns.forEach(col => {
    const values = rows.map(r => r[col])
    const sample = values[0]
    const type = typeof sample

    // Check if temporal
    if (typeof sample === 'string' && /^\d{4}-\d{2}/.test(sample)) {
      temporalFields.push(col)
      hasDateAxis = true
      return
    }

    // Check if numeric
    if (type === 'number' || (type === 'string' && !isNaN(Number(sample)))) {
      const numValues = values.map(v => Number(v)).filter(v => !isNaN(v))
      if (numValues.length > 0) {
        numericFields.push(calculateFieldStats(col, numValues, values))
      }
      return
    }

    // Categorical
    if (type === 'string') {
      const uniqueValues = [...new Set(values)]
      const topValues = getTopValues(values, 5)
      categoricalFields.push({
        name: col,
        uniqueCount: uniqueValues.length,
        topValues,
      })
    }
  })

  return {
    totalRows: rows.length,
    numericFields,
    temporalFields,
    categoricalFields,
    hasDateAxis,
    hasMultipleSeries: numericFields.length > 1,
  }
}

function calculateFieldStats(name: string, values: number[], original: unknown[]): FieldStats {
  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / values.length
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  const median = sorted[Math.floor(sorted.length / 2)]
  const nullCount = original.filter(v => v === null || v === undefined).length

  return {
    name,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: mean,
    median,
    stdDev,
    nullCount,
    cardinality: new Set(values.map(String)).size,
  }
}

function getTopValues(values: unknown[], limit: number): { value: string; count: number }[] {
  const counts: Record<string, number> = {}
  values.forEach(v => {
    const key = String(v ?? 'null')
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }))
}

/**
 * Score-based chart recommendation
 */
export function recommendChart(dataset: NormalizedDataset): ChartScore {
  const stats = analyzeDataset(dataset)

  const scores: ChartScore[] = []

  // LINE chart scoring
  let lineScore = 0
  if (stats.hasDateAxis) lineScore += 40
  if (stats.numericFields.length >= 1) lineScore += 30
  if (stats.numericFields.length === 1) lineScore += 10 // Single metric is better for line
  if (stats.totalRows > 10) lineScore += 10
  scores.push({
    chartType: 'LINE',
    score: lineScore,
    confidence: Math.min(lineScore / 100, 1),
    reasoning: 'Best for showing trends over time',
  })

  // BAR chart scoring
  let barScore = 0
  if (stats.categoricalFields.length > 0) barScore += 40
  if (stats.numericFields.length >= 1) barScore += 30
  if (stats.categoricalFields.some(f => f.uniqueCount <= 10)) barScore += 20
  scores.push({
    chartType: 'BAR',
    score: barScore,
    confidence: Math.min(barScore / 100, 1),
    reasoning: 'Best for comparing categories',
  })

  // PIE/DONUT chart scoring
  let pieScore = 0
  if (stats.categoricalFields.length > 0) pieScore += 30
  if (stats.categoricalFields.some(f => f.uniqueCount >= 2 && f.uniqueCount <= 8)) pieScore += 40
  if (stats.numericFields.length === 1) pieScore += 20
  scores.push({
    chartType: 'PIE',
    score: pieScore,
    confidence: Math.min(pieScore / 100, 1),
    reasoning: 'Best for showing part-to-whole relationships',
  })

  // KPI scoring
  let kpiScore = 0
  if (stats.totalRows === 1) kpiScore += 60
  if (stats.numericFields.length === 1) kpiScore += 30
  if (stats.numericFields.length === 0 && stats.categoricalFields.length === 1) kpiScore += 20
  scores.push({
    chartType: 'KPI',
    score: kpiScore,
    confidence: Math.min(kpiScore / 100, 1),
    reasoning: 'Best for displaying a single key metric',
  })

  // TABLE scoring
  let tableScore = 30
  if (stats.totalRows > 20) tableScore += 20
  if (stats.numericFields.length === 0 && stats.categoricalFields.length > 0) tableScore += 20
  scores.push({
    chartType: 'TABLE',
    score: tableScore,
    confidence: Math.min(tableScore / 100, 1),
    reasoning: 'Best for detailed data exploration',
  })

  // Sort by score
  scores.sort((a, b) => b.score - a.score)

  const top = scores[0]
  const runnerUps = scores.slice(1, 3)

  return {
    ...top,
    reasoning: `${top.reasoning}. Consider: ${runnerUps.map(r => r.chartType).join(', ')}`,
  }
}

// ============================================
// ANOMALY DETECTION
// ============================================

export function detectAnomalies(dataset: NormalizedDataset, field: string): AnomalyResult {
  const { rows } = dataset
  const values = rows.map(r => Number(r[field])).filter(v => !isNaN(v))

  if (values.length < 3) {
    return { field, anomalies: [], anomalyScore: 0 }
  }

  const stats = calculateFieldStats(field, values, values)
  const threshold = 2 * stats.stdDev

  const anomalies: Anomaly[] = []
  let anomalyCount = 0

  values.forEach((value, index) => {
    const deviation = Math.abs(value - stats.avg)
    if (deviation > threshold) {
      anomalies.push({
        index,
        value,
        expected: stats.avg,
        deviation: deviation / stats.stdDev,
        type: value > stats.avg ? 'high' : 'low',
      })
      anomalyCount++
    }
  })

  return {
    field,
    anomalies,
    anomalyScore: anomalyCount / values.length,
  }
}

// ============================================
// TREND ANALYSIS
// ============================================

export function detectTrend(values: number[]): TrendResult {
  if (values.length < 2) {
    return { direction: 'stable', percentage: 0 }
  }

  // Simple linear regression
  const n = values.length
  const indices = values.map((_, i) => i)
  const sumX = indices.reduce((a, b) => a + b, 0)
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0)
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const avgValue = sumY / n
  const slopePercentage = avgValue !== 0 ? (slope / avgValue) * 100 : 0

  // Check for fluctuation (high variance in differences)
  const differences = values.slice(1).map((v, i) => v - values[i])
  const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length
  const variance = differences.reduce((sum, d) => sum + Math.pow(d - avgDiff, 2), 0) / differences.length
  const isFluctuating = Math.sqrt(variance) > Math.abs(avgDiff) * 0.5

  let direction: TrendResult['direction']
  if (isFluctuating) {
    direction = 'fluctuating'
  } else if (Math.abs(slopePercentage) < 1) {
    direction = 'stable'
  } else if (slopePercentage > 0) {
    direction = 'increasing'
  } else {
    direction = 'decreasing'
  }

  return {
    direction,
    percentage: Math.abs(slopePercentage),
    seasonality: detectSeasonality(values),
  }
}

function detectSeasonality(values: number[]): TrendResult['seasonality'] {
  if (values.length < 12) {
    return { detected: false }
  }

  // Simple autocorrelation check for monthly patterns
  const period = 12 // Monthly
  if (values.length < period * 2) {
    return { detected: false }
  }

  // Check if correlation between values N periods apart is high
  const firstHalf = values.slice(0, Math.floor(values.length / 2))
  const secondHalf = values.slice(Math.floor(values.length / 2))

  if (firstHalf.length !== secondHalf.length) {
    return { detected: false }
  }

  let correlation = 0
  for (let i = 0; i < firstHalf.length; i++) {
    correlation += Math.abs(firstHalf[i] - secondHalf[i])
  }
  correlation = 1 - (correlation / (firstHalf.length * 2))

  return {
    detected: correlation > 0.7,
    period: correlation > 0.7 ? period : undefined,
  }
}

// ============================================
// AI INSIGHT GENERATION
// ============================================

export function generateInsight(dataset: NormalizedDataset): {
  summary: string
  observations: string[]
  trend?: TrendResult
  anomalies: AnomalyResult[]
} {
  const stats = analyzeDataset(dataset)

  const observations: string[] = []
  const anomalies: AnomalyResult[] = []

  // Basic stats observation
  observations.push(`Dataset contains ${stats.totalRows.toLocaleString()} rows`)

  // Numeric fields analysis
  stats.numericFields.forEach(field => {
    observations.push(
      `${field.name}: Range ${formatNumber(field.min)} - ${formatNumber(field.max)}, Avg: ${formatNumber(field.avg)}`
    )

    // Detect anomalies
    const anomalyResult = detectAnomalies(dataset, field.name)
    if (anomalyResult.anomalyScore > 0.05) {
      anomalies.push(anomalyResult)
      observations.push(
        `${field.name}: ${Math.round(anomalyResult.anomalyScore * 100)}% of values are anomalies`
      )
    }
  })

  // Categorical fields analysis
  stats.categoricalFields.forEach(field => {
    if (field.uniqueCount <= 10) {
      observations.push(
        `${field.name}: ${field.uniqueCount} categories (${field.topValues.slice(0, 3).map(v => v.value).join(', ')}...)`
      )
    }
  })

  // Trend analysis
  let trend: TrendResult | undefined
  if (stats.numericFields.length > 0 && stats.totalRows > 2) {
    const firstField = stats.numericFields[0]
    const values = dataset.rows.map(r => Number(r[firstField.name])).filter(v => !isNaN(v))
    trend = detectTrend(values)

    if (trend.direction !== 'stable') {
      observations.push(
        `${firstField.name}: ${trend.direction} trend (${trend.percentage.toFixed(1)}% ${trend.direction})`
      )
    }
  }

  const summary = buildSummary(stats, trend, anomalies)

  return { summary, observations, trend, anomalies }
}

function formatNumber(num: number): string {
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toFixed(0)
}

function buildSummary(
  stats: DataStatistics,
  trend: TrendResult | undefined,
  anomalies: AnomalyResult[]
): string {
  const parts: string[] = []

  if (stats.totalRows > 0) {
    parts.push(`${stats.totalRows.toLocaleString()} data points`)
  }

  if (stats.numericFields.length > 0) {
    parts.push(`${stats.numericFields.length} numeric metric(s)`)
  }

  if (stats.categoricalFields.length > 0) {
    parts.push(`${stats.categoricalFields.length} categorical field(s)`)
  }

  if (trend && trend.direction !== 'stable') {
    parts.push(`${trend.direction} trend detected`)
  }

  if (anomalies.length > 0) {
    parts.push(`${anomalies.length} field(s) with anomalies`)
  }

  return parts.join(' • ') || 'No data available'
}
