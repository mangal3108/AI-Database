import type { SchemaContext } from '../ai-query/ai-query-generator'

export interface AmbiguityResult {
  isAmbiguous: boolean
  options?: string[]
  reason?: string
}

/**
 * Detects if a user's metric request matches multiple possible columns.
 * For example, "revenue" might match "gross_revenue" and "net_revenue".
 */
export class AmbiguityDetector {
  static check(question: string, schema: SchemaContext): AmbiguityResult {
    const q = question.toLowerCase()
    
    // Revenue ambiguity example
    if (q.includes('revenue')) {
      const revenueColumns = schema.tables.flatMap(t => 
        t.columns
          .filter(c => c.name.toLowerCase().includes('revenue'))
          .map(c => c.name)
      )

      if (revenueColumns.length > 1) {
        return {
          isAmbiguous: true,
          options: revenueColumns,
          reason: 'I found multiple possible revenue metrics. Which one should I use?'
        }
      }
    }

    // Sales ambiguity
    if (q.includes('sales')) {
      const salesColumns = schema.tables.flatMap(t => 
        t.columns
          .filter(c => c.name.toLowerCase().includes('sales'))
          .map(c => c.name)
      )

      if (salesColumns.length > 1) {
        return {
          isAmbiguous: true,
          options: salesColumns,
          reason: 'I found multiple possible sales fields. Which one should I use?'
        }
      }
    }

    return { isAmbiguous: false }
  }
}
