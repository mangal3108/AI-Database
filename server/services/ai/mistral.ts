import { BaseAIProvider } from './base-provider'
import type { ChatMessage, ChatOptions, ChatResponse, EmbeddingResponse, ProviderName } from './provider'
import { AIProviderHealthService } from './health-service'

const MISTRAL_BASE_URL = 'https://api.mistral.ai/v1'

export class MistralProvider extends BaseAIProvider {
  readonly name: ProviderName = 'mistral'
  readonly model: string
  private apiKey: string
  private embeddingModel: string

  constructor() {
    super()
    this.apiKey = process.env.MISTRAL_API_KEY || ''
    this.model = process.env.MISTRAL_MODEL || 'mistral-small-latest'
    this.embeddingModel = process.env.MISTRAL_EMBEDDING_MODEL || 'mistral-embed'
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
      throw new Error('MISTRAL_API_KEY environment variable is not configured')
    }

    try {
      const response = await this.fetchWithRetry('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options.temperature ?? 0.1,
          max_tokens: options.maxTokens ?? 4096,
          stream: false,
        }),
      })

      const data = await response.json() as {
        choices: Array<{ message: { content: string } }>
        usage?: { prompt_tokens: number; completion_tokens: number }
        model?: string
      }

      const latencyMs = Date.now() - start
      const inputTokens = data.usage?.prompt_tokens ?? 0
      const outputTokens = data.usage?.completion_tokens ?? 0

      AIProviderHealthService.recordMetric({
        provider: this.name,
        model: this.model,
        latencyMs,
        tokens: inputTokens + outputTokens,
        success: true,
        failure: false,
        rateLimit: false,
        timestamp: new Date(),
      })

      return {
        content: data.choices[0]?.message?.content ?? '',
        inputTokens,
        outputTokens,
        model: data.model ?? this.model,
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

  async *streamChat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const response = await this.fetchWithRetry('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.1,
        max_tokens: options.maxTokens ?? 4096,
        stream: true,
      }),
    })

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data) as {
            choices: Array<{ delta: { content?: string } }>
          }
          const content = parsed.choices[0]?.delta?.content
          if (content) yield content
        } catch {
          // Skip malformed SSE events
        }
      }
    }
  }

  async generateStructuredOutput<T>(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<T> {
    // Add instruction to return valid JSON
    const systemMessage: ChatMessage = {
      role: 'system',
      content: 'You must respond with valid JSON only. No markdown, no code blocks, no explanations outside JSON.',
    }
    const allMessages = [systemMessage, ...messages]

    const response = await this.chat(allMessages, {
      ...options,
      temperature: options.temperature ?? 0.0,
    })

    // Extract JSON from response (handle cases where model wraps in markdown)
    let content = response.content.trim()
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      content = jsonMatch[1]!.trim()
    }

    try {
      return JSON.parse(content) as T
    } catch {
      throw new Error(`Failed to parse structured output: ${content.substring(0, 200)}`)
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResponse> {
    const response = await this.fetchWithRetry('/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        model: this.embeddingModel,
        input: [text],
        encoding_format: 'float',
      }),
    })

    const data = await response.json() as {
      data: Array<{ embedding: number[] }>
      usage?: { prompt_tokens: number }
    }

    return {
      embedding: data.data[0]?.embedding ?? [],
      inputTokens: data.usage?.prompt_tokens,
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${MISTRAL_BASE_URL}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  private async fetchWithRetry(
    path: string,
    init: RequestInit,
    maxRetries = 3
  ): Promise<Response> {
    const url = `${MISTRAL_BASE_URL}${path}`
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, 1000 * 2 ** (attempt - 1)))
      }

      try {
        const response = await fetch(url, {
          ...init,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...init.headers,
          },
          signal: AbortSignal.timeout(60000),
        })

        if (response.status === 429) {
          // Rate limited — retry after backoff
          const retryAfter = response.headers.get('retry-after')
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000
          await new Promise((r) => setTimeout(r, delay))
          continue
        }

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Mistral API error ${response.status}: ${error}`)
        }

        return response
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        if (attempt < maxRetries - 1) continue
      }
    }

    throw lastError ?? new Error('Mistral API request failed after retries')
  }
}
