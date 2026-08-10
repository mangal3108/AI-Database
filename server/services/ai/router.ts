import type { AIProvider, ChatMessage, ChatOptions, ChatResponse, EmbeddingResponse, ProviderName, TaskType } from './provider'
import { MistralProvider } from './mistral'
import { GeminiProvider } from './gemini'
import { GroqProvider, CerebrasProvider, OpenRouterProvider } from './openai-compatible'
import { AIProviderHealthService } from './health-service'

export interface RouterOptions {
  taskType?: TaskType
  preferredProvider?: ProviderName
  organizationPlan?: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'
}

export class AIRouter {
  private providers: Record<ProviderName, AIProvider> = {
    mistral: new MistralProvider(),
    gemini: new GeminiProvider(),
    groq: new GroqProvider(),
    cerebras: new CerebrasProvider(),
    openrouter: new OpenRouterProvider(),
  }

  // Multi-provider fallback chain: Primary -> Secondary -> Tertiary
  private getFallbackChain(preferred?: ProviderName): ProviderName[] {
    const defaultChain: ProviderName[] = ['mistral', 'gemini', 'groq', 'cerebras', 'openrouter']
    if (!preferred) return defaultChain
    return [preferred, ...defaultChain.filter(p => p !== preferred)]
  }

  /**
   * Execute chat completion with intelligent multi-provider fallback.
   * Only falls back on rate limits, timeouts, & provider unavailability.
   * Never falls back on invalid user prompts/payload errors.
   */
  async chat(messages: ChatMessage[], options: ChatOptions = {}, routerOpts: RouterOptions = {}): Promise<ChatResponse> {
    const chain = this.getFallbackChain(routerOpts.preferredProvider)
    let lastError: Error | null = null

    for (const providerName of chain) {
      // Check circuit breaker & health
      if (!AIProviderHealthService.isProviderHealthy(providerName)) {
        console.warn(`[AI ROUTER] Skipping unhealthy/rate-limited provider: ${providerName}`)
        continue
      }

      const provider = this.providers[providerName]

      try {
        console.log(`[AI ROUTER] Attempting request with provider: ${providerName}`)
        return await provider.chat(messages, options)
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err))
        const errorMessage = lastError.message.toLowerCase()

        // Check if error is a fallback-eligible error
        const isRateLimit = errorMessage.includes('429') || errorMessage.includes('rate limit')
        const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('timed out')
        const isUnavailable = errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503') || errorMessage.includes('unavailable') || errorMessage.includes('not configured')

        if (isRateLimit || isTimeout || isUnavailable) {
          console.warn(`[AI ROUTER] Fallback triggered from ${providerName} due to transient error: ${lastError.message}`)
          continue // Fallback to next provider in chain
        }

        // Fatal/invalid user request error — DO NOT fallback
        console.error(`[AI ROUTER] Non-retryable error on ${providerName}: ${lastError.message}`)
        throw lastError
      }
    }

    throw lastError ?? new Error('All AI providers in the fallback chain failed or are unhealthy')
  }

  /**
   * Get an embedding vector (uses Mistral or Gemini fallback)
   */
  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    if (AIProviderHealthService.isProviderHealthy('mistral')) {
      try {
        return await this.providers.mistral.generateEmbedding(text)
      } catch {
        // Fallback to Gemini
      }
    }
    return await this.providers.gemini.generateEmbedding(text)
  }

  getProvider(name: ProviderName): AIProvider {
    return this.providers[name]
  }

  getHealthSummary() {
    return AIProviderHealthService.getMetricsSummary()
  }
}

export const aiRouter = new AIRouter()

export function getAIProvider(preferred?: ProviderName): AIProvider {
  if (preferred && AIProviderHealthService.isProviderHealthy(preferred)) {
    return aiRouter.getProvider(preferred)
  }
  return aiRouter.getProvider('mistral')
}
