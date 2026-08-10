import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import type { NormalizedDataset } from '@/server/services/visualization/types'

/**
 * POST /api/visualizations/export
 * Export visualization data in various formats
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await getTenantContext(session.user.id)
    const body = await req.json()

    const { dataset, format, chartType, chartTitle } = body as {
      dataset: NormalizedDataset
      format: 'CSV' | 'JSON' | 'PNG' | 'SVG'
      chartType?: string
      chartTitle?: string
    }

    if (!dataset || !dataset.columns || !dataset.rows) {
      return NextResponse.json({ error: 'Invalid dataset' }, { status: 400 })
    }

    switch (format) {
      case 'CSV':
        return exportCSV(dataset, chartTitle)
      case 'JSON':
        return exportJSON(dataset, chartTitle)
      case 'PNG':
      case 'SVG':
        return NextResponse.json({
          success: true,
          message: `${format} export requires client-side rendering`,
          columns: dataset.columns,
          rowCount: dataset.rows.length,
        })
      default:
        return NextResponse.json({ error: `Unsupported format: ${format}` }, { status: 400 })
    }
  } catch (err) {
    console.error('[VISUALIZATION] Export error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Export failed' },
      { status: 500 }
    )
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function exportCSV(dataset: NormalizedDataset, title?: string): NextResponse {
  const headers = dataset.columns.join(',')
  const rows = dataset.rows.map(row =>
    dataset.columns.map(col => {
      const value = row[col]
      if (value === null || value === undefined) return ''
      const strValue = String(value)
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
    }).join(',')
  )

  const csv = [
    `# ${title || 'Export from Internite AI'}`,
    `# Exported: ${new Date().toISOString()}`,
    `# Rows: ${dataset.rows.length}, Columns: ${dataset.columns.length}`,
    '',
    headers,
    ...rows,
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${slugify(title || 'export')}.csv"`,
    },
  })
}

function exportJSON(dataset: NormalizedDataset, title?: string): NextResponse {
  const exportData = {
    title: title || 'Export from Internite AI',
    exported: new Date().toISOString(),
    metadata: {
      rowCount: dataset.rows.length,
      columnCount: dataset.columns.length,
      columns: dataset.columns,
    },
    data: dataset.rows,
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${slugify(title || 'export')}.json"`,
    },
  })
}
