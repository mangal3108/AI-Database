/**
 * Token Optimization & Budget Engine — Internite AI
 * 
 * Provides:
 * 1. Fast Query Complexity Classifier (SIMPLE, MEDIUM, COMPLEX, CONVERSATIONAL)
 * 2. Strict Token Budget Allocator & Context Trimmer
 * 3. Semantic Schema Filtering (retrieve only relevant tables based on question)
 * 4. Token & Cost Observability Tracking
 */

export type QueryComplexity = 'CONVERSATIONAL' | 'SIMPLE' | 'MEDIUM' | 'COMPLEX'

export interface TokenBudget {
  systemPromptMaxTokens: number
  schemaMaxTokens: number
  ragMaxTokens: number
  historyMaxTokens: number
  outputMaxTokens: number
  totalMaxTokens: number
}

export const BUDGET_TIERS: Record<QueryComplexity, TokenBudget> = {
  CONVERSATIONAL: {
    systemPromptMaxTokens: 800,
    schemaMaxTokens: 0,
    ragMaxTokens: 500,
    historyMaxTokens: 1000,
    outputMaxTokens: 400,
    totalMaxTokens: 2700,
  },
  SIMPLE: {
    systemPromptMaxTokens: 1000,
    schemaMaxTokens: 1500,
    ragMaxTokens: 1000,
    historyMaxTokens: 800,
    outputMaxTokens: 600,
    totalMaxTokens: 4900,
  },
  MEDIUM: {
    systemPromptMaxTokens: 1200,
    schemaMaxTokens: 3000,
    ragMaxTokens: 2000,
    historyMaxTokens: 1200,
    outputMaxTokens: 1000,
    totalMaxTokens: 8400,
  },
  COMPLEX: {
    systemPromptMaxTokens: 1500,
    schemaMaxTokens: 5000,
    ragMaxTokens: 3500,
    historyMaxTokens: 2000,
    outputMaxTokens: 1500,
    totalMaxTokens: 13500,
  },
}

/**
 * Fast deterministic & rule-based classification of query complexity
 */
export function classifyQueryComplexity(userMessage: string): QueryComplexity {
  const text = userMessage.trim().toLowerCase()

  // 1. Conversational / Meta Greetings
  const conversationalKeywords = ['hello', 'hi', 'hey', 'thanks', 'thank you', 'who are you', 'help', 'what can you do']
  if (conversationalKeywords.some((kw) => text === kw || text.startsWith(kw + ' '))) {
    return 'CONVERSATIONAL'
  }

  // 2. Complex Keywords (Joins, aggregations, time-series, comparisons)
  const complexKeywords = ['join', 'group by', 'compare', 'trend', 'analytics', 'cohort', 'churn', 'retention', 'quarter', 'year over year', 'yoy']
  const commaCount = (text.match(/,/g) || []).length
  const wordCount = text.split(/\s+/).length

  if (complexKeywords.some((kw) => text.includes(kw)) || wordCount > 25 || commaCount >= 3) {
    return 'COMPLEX'
  }

  // 3. Medium Keywords
  const mediumKeywords = ['total', 'average', 'count', 'sum', 'top', 'highest', 'lowest', 'monthly', 'daily', 'filter', 'where', 'between']
  if (mediumKeywords.some((kw) => text.includes(kw)) || wordCount > 10) {
    return 'MEDIUM'
  }

  // 4. Simple queries (Single table lookup or count)
  return 'SIMPLE'
}

/**
 * Approximate token count helper (4 characters ≈ 1 token)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  return Math.ceil(text.length / 4)
}

/**
 * Semantic Schema Pruning: Filter full database schema down to only relevant tables
 */
export function pruneSchemaByQuestion(schemaText: string, question: string, complexity: QueryComplexity): string {
  if (complexity === 'CONVERSATIONAL') return ''
  if (!schemaText) return ''

  const qLower = question.toLowerCase()

  // Split schema by table headers (assumes markdown or SQL style table definitions)
  const tableBlocks = schemaText.split(/(?=Table:\s+|CREATE TABLE\s+|##\s+)/i)

  if (tableBlocks.length <= 3) return schemaText // If small schema, keep all

  // Match table blocks against words in user question
  const scoredBlocks = tableBlocks.map((block) => {
    const blockLower = block.toLowerCase()
    let score = 0
    
    // Extract table name
    const match = blockLower.match(/(?:table:\s*|create table\s*|##\s*)([a-z0-0_]+)/i)
    const tableName = match ? match[1] : ''

    if (tableName && qLower.includes(tableName)) {
      score += 10
    }

    // Match column names & keywords
    const words = qLower.split(/[^a-z0-9_]+/).filter((w) => w.length > 2)
    for (const word of words) {
      if (blockLower.includes(word)) {
        score += 2
      }
    }

    return { block, score }
  })

  // Sort by score
  scoredBlocks.sort((a, b) => b.score - a.score)

  // Select top K based on complexity
  const maxTables = complexity === 'SIMPLE' ? 3 : complexity === 'MEDIUM' ? 6 : 12
  const selectedBlocks = scoredBlocks
    .filter((item, idx) => item.score > 0 || idx < 2) // keep at least 2 tables or scored ones
    .slice(0, maxTables)
    .map((item) => item.block)

  return selectedBlocks.join('\n\n')
}

/**
 * Calculates Token Observability Metrics & Estimated Costs
 */
export function calculateTokenMetrics(
  inputTokens: number,
  outputTokens: number,
  provider: string = 'gemini'
) {
  // Approximate pricing per 1M tokens ($)
  let inputRate = 0.15 / 1000000
  let outputRate = 0.60 / 1000000

  if (provider.includes('openai') || provider.includes('gpt-4')) {
    inputRate = 2.50 / 1000000
    outputRate = 10.00 / 1000000
  } else if (provider.includes('claude')) {
    inputRate = 3.00 / 1000000
    outputRate = 15.00 / 1000000
  }

  const estimatedCostUsd = inputTokens * inputRate + outputTokens * outputRate

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
  }
}
