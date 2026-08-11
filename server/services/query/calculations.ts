export class CalculationsEngine {
  /**
   * Deterministically calculates totals, percentages, growth, etc.
   */
  static calculate(rows: Record<string, unknown>[], operation: string, columns: string[]): number | null {
    if (rows.length === 0) return null

    switch (operation.toLowerCase()) {
      case 'sum':
      case 'total':
        return this.sum(rows, columns[0]!)
      case 'avg':
      case 'average':
        return this.avg(rows, columns[0]!)
      case 'min':
        return this.min(rows, columns[0]!)
      case 'max':
        return this.max(rows, columns[0]!)
      case 'growth':
      case 'percentage_change':
        if (rows.length >= 2) {
          const oldVal = Number(rows[0]![columns[0]!])
          const newVal = Number(rows[rows.length - 1]![columns[0]!])
          return oldVal !== 0 ? ((newVal - oldVal) / oldVal) * 100 : null
        }
        return null
      default:
        return null
    }
  }

  private static sum(rows: Record<string, unknown>[], col: string): number {
    return rows.reduce((acc, row) => acc + (Number(row[col]) || 0), 0)
  }

  private static avg(rows: Record<string, unknown>[], col: string): number {
    return this.sum(rows, col) / rows.length
  }

  private static min(rows: Record<string, unknown>[], col: string): number {
    return Math.min(...rows.map(r => Number(r[col]) || Infinity))
  }

  private static max(rows: Record<string, unknown>[], col: string): number {
    return Math.max(...rows.map(r => Number(r[col]) || -Infinity))
  }
}
