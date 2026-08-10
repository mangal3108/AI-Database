'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'

interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTimeMs: number
}

interface ResultTableProps {
  result: QueryResult
  maxRows?: number
}

export function ResultTable({ result, maxRows = 100 }: ResultTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)
  const pageSize = 50

  const sortedRows = useMemo(() => {
    if (!sortColumn) return result.rows.slice(0, maxRows)
    return [...result.rows].slice(0, maxRows).sort((a, b) => {
      const av = a[sortColumn]
      const bv = b[sortColumn]
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [result.rows, sortColumn, sortDir, maxRows])

  const paginatedRows = sortedRows.slice(page * pageSize, (page + 1) * pageSize)
  const totalPages = Math.ceil(sortedRows.length / pageSize)

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(col)
      setSortDir('asc')
    }
  }

  const exportCsv = () => {
    const header = result.columns.join(',')
    const rows = result.rows.slice(0, maxRows).map(row =>
      result.columns.map(col => {
        const val = row[col]
        if (val == null) return ''
        const str = String(val)
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'query-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (result.rows.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        Query returned 0 rows in {result.executionTimeMs}ms
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border/50">
        <span className="text-xs text-muted-foreground">
          {result.rowCount.toLocaleString()} rows · {result.executionTimeMs}ms
        </span>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download size={12} />
          CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-72">
        <table className="data-table">
          <thead className="sticky top-0 z-10">
            <tr>
              {result.columns.map(col => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="cursor-pointer select-none hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    {sortColumn === col && (
                      sortDir === 'asc'
                        ? <ChevronUp size={10} />
                        : <ChevronDown size={10} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, i) => (
              <tr key={i}>
                {result.columns.map(col => (
                  <td key={col} title={String(row[col] ?? '')}>
                    {row[col] == null
                      ? <span className="text-muted-foreground italic text-xs">null</span>
                      : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
