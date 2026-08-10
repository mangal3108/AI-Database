import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import {
  analyzeDataset,
  detectAnomalies,
  detectTrend,
  recommendChart
} from '@/server/services/visualization/chart-recommendation-engine'
import type { NormalizedDataset } from '@/server/services/visualization/types'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await getTenantContext(session.user.id)
    const body = await req.json()

    const { dataset } = body as { dataset: NormalizedDataset }

    if (!dataset || !dataset.columns || !dataset.rows) {
      return NextResponse.json({ error: 'Invalid dataset' }, { status: 400 })
    }

    // Analyze dataset
    const stats = analyzeDataset(dataset)
    const recommendation = recommendChart(dataset)

    // Generate trends
    const trends = stats.numericFields.slice(0, 3).map(field => {
      const values = dataset.rows.map(r => Number(r[field.name])).filter(v => !isNaN(v))
      const trend = detectTrend(values)
      return {
        field: field.name,
        direction: trend.direction,
        percentage: trend.percentage,
      }
    })

    // Generate anomalies
    const anomalies = stats.numericFields.slice(0, 2).map(field => {
      const result = detectAnomalies(dataset, field.name)
      return {
        field: field.name,
        anomalyScore: result.anomalyScore,
        count: result.anomalies.length,
        details: result.anomalies.slice(0, 3),
      }
    })

    // Generate observations
    const observations: string[] = []

    if (stats.totalRows > 1000) {
      observations.push(`This dataset contains ${stats.totalRows.toLocaleString()} rows.`)
    }

    if (stats.numericFields.length > 0) {
      const avgField = stats.numericFields[0]
      observations.push(`${avgField.name} ranges from ${avgField.min.toLocaleString()} to ${avgField.max.toLocaleString()}.`)
    }

    if (stats.hasDateAxis) {
      observations.push('Date-based analysis available.')
    }

    // Build summary
    const summary = `This dataset contains ${stats.totalRows.toLocaleString()} rows with ${stats.numericFields.length} numeric field(s) and ${stats.categoricalFields.length} categorical field(s).`

    return NextResponse.json({
      summary,
      statistics: {
        totalRows: stats.totalRows,
        numericFieldCount: stats.numericFields.length,
        temporalFieldCount: stats.temporalFields.length,
        categoricalFieldCount: stats.categoricalFields.length,
      },
      recommendedChart: {
        type: recommendation.chartType,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
      },
      trends,
      anomalies,
      observations,
    })
  } catch (err) {
    console.error('[VISUALIZATION] Insight error:', err)
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}
