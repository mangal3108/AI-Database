import type { HealthMetric, ProviderName } from './provider'

export interface ProviderCircuitState {
  failureCount: number
  lastFailureTime?: number
  circuitOpen: boolean
  rateLimitUntil?: number
}

class HealthService {
  private metrics: HealthMetric[] = []
  private states: Record<ProviderName, ProviderCircuitState> = {
    mistral: { failureCount: 0, circuitOpen: false },
    gemini: { failureCount: 0, circuitOpen: false },
    groq: { failureCount: 0, circuitOpen: false },
    cerebras: { failureCount: 0, circuitOpen: false },
    openrouter: { failureCount: 0, circuitOpen: false },
  }

  private readonly FAILURE_THRESHOLD = 3
  private readonly CIRCUIT_RESET_MS = 60000 // 1 min circuit breaker
  private readonly MAX_LOG_SIZE = 500

  recordMetric(metric: HealthMetric) {
    this.metrics.push(metric)
    if (this.metrics.length > this.MAX_LOG_SIZE) {
      this.metrics.shift()
    }

    const state = this.states[metric.provider]
    if (!state) return

    if (metric.success) {
      state.failureCount = Math.max(0, state.failureCount - 1)
      if (state.failureCount === 0) {
        state.circuitOpen = false
      }
    } else {
      state.failureCount += 1
      state.lastFailureTime = Date.now()

      if (metric.errorType === 'RATE_LIMIT') {
        state.rateLimitUntil = Date.now() + 30000 // 30s rate limit penalty
      }

      if (state.failureCount >= this.FAILURE_THRESHOLD) {
        state.circuitOpen = true
        console.warn(`[AI CIRCUIT BREAKER] Opened circuit for provider: ${metric.provider}`)
      }
    }
  }

  isProviderHealthy(provider: ProviderName): boolean {
    const state = this.states[provider]
    if (!state) return false

    // Reset circuit if timeout expired
    if (state.circuitOpen && state.lastFailureTime) {
      if (Date.now() - state.lastFailureTime > this.CIRCUIT_RESET_MS) {
        state.circuitOpen = false
        state.failureCount = 0
      }
    }

    if (state.rateLimitUntil && Date.now() < state.rateLimitUntil) {
      return false
    }

    return !state.circuitOpen
  }

  getMetricsSummary() {
    const summary: Record<string, { totalRequests: number; successRate: string; avgLatencyMs: number }> = {}

    for (const provider of ['mistral', 'gemini', 'groq', 'cerebras', 'openrouter'] as ProviderName[]) {
      const pMetrics = this.metrics.filter(m => m.provider === provider)
      const total = pMetrics.length
      const successes = pMetrics.filter(m => m.success).length
      const avgLat = total > 0 ? Math.round(pMetrics.reduce((acc, m) => acc + m.latencyMs, 0) / total) : 0

      summary[provider] = {
        totalRequests: total,
        successRate: total > 0 ? `${Math.round((successes / total) * 100)}%` : '100%',
        avgLatencyMs: avgLat,
      }
    }

    return summary
  }
}

export const AIProviderHealthService = new HealthService()
