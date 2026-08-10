import { BaseAIProvider } from './base-provider'
import type { ChatMessage, ChatOptions, ChatResponse, EmbeddingResponse, ProviderName } from './provider'
import { AIProviderHealthService } from './health-service'

export class GeminiProvider extends BaseAIProvider {
  readonly name: ProviderName = 'gemini'
  readonly model: string
  private apiKey: string

  constructor() {
    super()
    this.apiKey = process.env.GEMINI_API_KEY || ''
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
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
      throw new Error('GEMINI_API_KEY environment variable is not configured')
    }

    try {
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role === 'system' ? 'user' : 'user',
        parts: [{ text: m.content }],
      }))

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: options.temperature ?? 0.1,
              maxOutputTokens: options.maxTokens ?? 4096,
            },
          }),
        }
      )

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
        throw new Error('Gemini API rate limit exceeded')
      }

      if (!res.ok) {
        throw new Error(`Gemini API error ${res.status}: ${await res.text()}`)
      }

      const data = await res.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
      }

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      const latencyMs = Date.now() - start

      AIProviderHealthService.recordMetric({
        provider: this.name,
        model: this.model,
        latencyMs,
        tokens: (data.usageMetadata?.promptTokenCount ?? 0) + (data.usageMetadata?.candidatesTokenCount ?? 0),
        success: true,
        failure: false,
        rateLimit: false,
        timestamp: new Date(),
      })

      return {
        content,
        inputTokens: data.usageMetadata?.promptTokenCount,
        outputTokens: data.usageMetadata?.candidatesTokenCount,
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
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text }] },
        }),
      }
    )
    if (!res.ok) throw new Error(`Gemini Embedding error: ${await res.text()}`)
    const data = await res.json() as { embedding?: { values: number[] } }
    return { embedding: data.embedding?.values ?? [] }
  }
}
