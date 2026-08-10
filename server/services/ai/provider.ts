// AI Provider Interface Definition
// Support for Mistral, Google Gemini, Groq, Cerebras, OpenRouter

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatOptions {
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatResponse {
  content: string
  inputTokens?: number
  outputTokens?: number
  model?: string
  provider?: string
  latencyMs?: number
}

export interface EmbeddingResponse {
  embedding: number[]
  inputTokens?: number
}

export type TaskType = 
  | 'chat' 
  | 'query_generation' 
  | 'intent_classification' 
  | 'embedding' 
  | 'result_analysis'

export interface AIProvider {
  readonly name: ProviderName
  readonly model: string

  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>
  streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string, void, unknown>
  generateStructuredOutput<T>(messages: ChatMessage[], options?: ChatOptions): Promise<T>
  generateQuery(prompt: string, schemaContext: string): Promise<string>
  classifyIntent(message: string): Promise<{ intent: string; confidence: number }>
  generateEmbedding(text: string): Promise<EmbeddingResponse>
  analyzeResults(query: string, results: Record<string, unknown>[]): Promise<string>
  healthCheck(): Promise<boolean>
}

export type ProviderName = 'mistral' | 'gemini' | 'groq' | 'cerebras' | 'openrouter'

export interface HealthMetric {
  provider: ProviderName
  model: string
  latencyMs: number
  tokens: number
  success: boolean
  failure: boolean
  rateLimit: boolean
  errorType?: 'RATE_LIMIT' | 'TIMEOUT' | 'UNAVAILABLE' | 'BAD_REQUEST' | 'AUTH_ERROR' | 'UNKNOWN'
  timestamp: Date
}
