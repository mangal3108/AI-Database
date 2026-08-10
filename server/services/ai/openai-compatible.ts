import { BaseAIProvider } from './base-provider'
import type { ChatMessage, ChatOptions, ChatResponse, EmbeddingResponse, ProviderName } from './provider'
import { AIProviderHealthService } from './health-service'

export class OpenAICompatibleProvider extends BaseAIProvider {
  readonly name: ProviderName
  readonly model: string
  protected apiKey: string
  protected baseUrl: string

  constructor(name: ProviderName, defaultModel: string, defaultBaseUrl: string, envKeyName: string, envModelName: string) {
    super()
    this.name = name
    this.apiKey = process.env[envKeyName] || ''
    this.model = process.env[envModelName] || defaultModel
    this.baseUrl = defaultBaseUrl
  }

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    const start = Date.now()
    if (!this.apiKey) {
      AIProviderHealthService.recordMetric({
        provider: this.name,
        model: this.model,
        latencyMs: 0,
        tokens: 0,
        success: false,
        failure: true,
        rateLimit: false,
        errorType: 'AUTH_ERROR',
        timestamp: new Date(),
      })
      throw new Error(`${this.name.toUpperCase()} API key environment variable is not configured`)
    }

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options.temperature ?? 0.1,
          max_tokens: options.maxTokens ?? 4096,
        }),
      })

      if (res.status === 429) {
        AIProviderHealthService.recordMetric({
          provider: this.name,
          model: this.model,
          latencyMs: Date.now() - start,
          tokens: 0,
          success: false,
          failure: true,
          rateLimit: true,
          errorType: 'RATE_LIMIT',
          timestamp: new Date(),
        })
        throw new Error(`${this.name} API rate limit exceeded`)
      }

      if (!res.ok) {
        throw new Error(`${this.name} API error ${res.status}: ${await res.text()}`)
      }

      const data = await res.json() as {
        choices: Array<{ message: { content: string } }>
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
      }

      const content = data.choices[0]?.message?.content ?? ''
      const latencyMs = Date.now() - start

      AIProviderHealthService.recordMetric({
        provider: this.name,
        model: this.model,
        latencyMs,
        tokens: data.usage?.total_tokens ?? 0,
        success: true,
        failure: false,
        rateLimit: false,
        timestamp: new Date(),
      })

      return {
        content,
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
        model: this.model,
        provider: this.name,
        latencyMs,
      }
    } catch (err) {
      AIProviderHealthService.recordMetric({
        provider: this.name,
        model: this.model,
        latencyMs: Date.now() - start,
        tokens: 0,
        success: false,
        failure: true,
        rateLimit: false,
        errorType: 'UNAVAILABLE',
        timestamp: new Date(),
      })
      throw err
    }
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions = {}): AsyncGenerator<string, void, unknown> {
    const res = await this.chat(messages, options)
    yield res.content
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    return { embedding: [] }
  }
}

export class GroqProvider extends OpenAICompatibleProvider {
  constructor() {
    super('groq', 'llama-3.3-70b-versatile', 'https://api.groq.com/openai/v1', 'GROQ_API_KEY', 'GROQ_MODEL')
  }
}

export class CerebrasProvider extends OpenAICompatibleProvider {
  constructor() {
    super('cerebras', 'llama3.1-70b', 'https://api.cerebras.ai/v1', 'CEREBRAS_API_KEY', 'CEREBRAS_MODEL')
  }
}

export class OpenRouterProvider extends OpenAICompatibleProvider {
  constructor() {
    super('openrouter', 'meta-llama/llama-3.3-70b-instruct:free', 'https://openrouter.ai/api/v1', 'OPENROUTER_API_KEY', 'OPENROUTER_MODEL')
  }
}
