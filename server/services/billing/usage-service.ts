import { prisma } from '@/lib/prisma'

export type UsageMetric =
  | 'AI_QUERY'
  | 'AI_TOKEN'
  | 'DATABASE_CONNECTION'
  | 'DATABASE_QUERY'
  | 'API_REQUEST'
  | 'RAG_DOCUMENT'
  | 'STORAGE'
  | 'EXPORT'
  | 'CHAT_MESSAGE'
  | 'VISUALIZATION_CREATED'
  | 'VISUALIZATION_RENDERED'
  | 'VISUALIZATION_EXPORTED'

export interface RecordUsageParams {
  organizationId: string
  metric: UsageMetric
  quantity?: number
  userId?: string
  projectId?: string
  provider?: string
  model?: string
  databaseId?: string
  metadata?: Record<string, unknown>
}

export interface AiCostLogParams {
  organizationId: string
  userId?: string
  conversationId?: string
  databaseConnectionId?: string
  provider: string
  model: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
  fallback?: boolean
  fallbackReason?: string
}

export class UsageService {
  /**
   * Track organization usage and record atomic metric logs.
   */
  static async recordUsage(params: RecordUsageParams): Promise<number> {
    const quantity = params.quantity ?? 1
    const period = new Date().toISOString().slice(0, 7) // YYYY-MM

    // Atomic increment/upsert of monthly usage record
    const existing = await prisma.usageRecord.findFirst({
      where: {
        organizationId: params.organizationId,
        metric: params.metric,
        period,
      },
    })

    if (existing) {
      const updated = await prisma.usageRecord.update({
        where: { id: existing.id },
        data: { value: existing.value + quantity },
      })
      return updated.value
    } else {
      const created = await prisma.usageRecord.create({
        data: {
          organizationId: params.organizationId,
          projectId: params.projectId,
          userId: params.userId,
          metric: params.metric,
          value: quantity,
          period,
        },
      })
      return created.value
    }
  }

  /**
   * Log AI request metrics & costs accurately.
   */
  static async logAiCost(params: AiCostLogParams): Promise<void> {
    const totalTokens = params.inputTokens + params.outputTokens

    // Record AI Token usage
    await this.recordUsage({
      organizationId: params.organizationId,
      userId: params.userId,
      metric: 'AI_TOKEN',
      quantity: totalTokens,
      provider: params.provider,
      model: params.model,
      metadata: {
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        latencyMs: params.latencyMs,
        fallback: params.fallback ?? false,
        fallbackReason: params.fallbackReason,
      },
    })

    // If not a fallback attempt, count as 1 AI_QUERY
    if (!params.fallback) {
      await this.recordUsage({
        organizationId: params.organizationId,
        userId: params.userId,
        metric: 'AI_QUERY',
        quantity: 1,
        provider: params.provider,
        model: params.model,
      })
    }
  }

  /**
   * Get usage summary and warning status (80%, 90%, 100%)
   */
  static async getUsageStatus(organizationId: string, metric: UsageMetric, limit: number) {
    const period = new Date().toISOString().slice(0, 7)
    const usage = await prisma.usageRecord.findFirst({
      where: { organizationId, metric, period },
    })

    const current = usage?.value ?? 0
    const percentage = limit > 0 ? Math.min(100, Math.round((current / limit) * 100)) : 0

    let warningLevel: 'NONE' | 'WARNING' | 'STRONG_WARNING' | 'LIMIT_REACHED' = 'NONE'
    if (percentage >= 100) warningLevel = 'LIMIT_REACHED'
    else if (percentage >= 90) warningLevel = 'STRONG_WARNING'
    else if (percentage >= 80) warningLevel = 'WARNING'

    return {
      current,
      limit,
      percentage,
      warningLevel,
    }
  }
}
