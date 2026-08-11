import { getAIProvider } from '../ai'
import { CalculationsEngine } from '../query/calculations'

export interface QueryResultEnvelope {
  queryId?: string
  databaseId: string
  sql: string
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  executionTime: number
  metadata?: Record<string, unknown>
}

const ANSWER_GENERATION_PROMPT = `You are a strict data-grounded assistant. Your job is to explain the database result to the user.

RULES:
1. NEVER invent or hallucinate numbers, dates, categories, or trends.
2. The provided JSON result is the ABSOLUTE SOURCE OF TRUTH.
3. If the user's question asks for information not present in the result, state clearly that it is unavailable.
4. Keep the explanation concise and direct.
5. Do NOT include raw JSON in your response.

Here is the database result:`

export class AnswerGenerator {
  static async generateAnswer(question: string, envelope: QueryResultEnvelope): Promise<string> {
    const ai = getAIProvider()
    
    // Convert rows to a string representation, truncate if too large
    const maxRowsForContext = 50
    const displayRows = envelope.rows.slice(0, maxRowsForContext)
    
    const context = JSON.stringify({
      columns: envelope.columns,
      rowCount: envelope.rowCount,
      data: displayRows,
      truncated: envelope.rowCount > maxRowsForContext
    }, null, 2)

    const prompt = `${ANSWER_GENERATION_PROMPT}
\`\`\`json
${context}
\`\`\`

User Question: ${question}

Answer:`

    try {
      const response = await ai.chat([
        { role: 'user', content: prompt }
      ], { temperature: 0.1 })
      
      return response.content
    } catch (err) {
      console.error('[ANSWER-GENERATOR] Failed to generate grounded answer:', err)
      return 'The database query was successful, but I encountered an error explaining the result.'
    }
  }
}
