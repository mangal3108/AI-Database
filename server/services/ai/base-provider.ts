import type { AIProvider, ChatMessage, ChatOptions, ChatResponse, EmbeddingResponse, ProviderName } from './provider'
import { AIProviderHealthService } from './health-service'

export abstract class BaseAIProvider implements AIProvider {
  abstract readonly name: ProviderName
  abstract readonly model: string

  abstract chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>
  abstract streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string, void, unknown>
  abstract generateEmbedding(text: string): Promise<EmbeddingResponse>

  async generateStructuredOutput<T>(messages: ChatMessage[], options?: ChatOptions): Promise<T> {
    const systemMsg: ChatMessage = {
      role: 'system',
      content: 'You are a precise JSON generator. Respond strictly with valid JSON. No markdown code blocks, no text surrounding JSON.',
    }
    const resp = await this.chat([systemMsg, ...messages], { ...options, temperature: 0.0 })
    let text = resp.content.trim()
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (match) text = match[1]!.trim()
    return JSON.parse(text) as T
  }

  async generateQuery(prompt: string, schemaContext: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert SQL & Database query generator.\nSCHEMA:\n${schemaContext}\nReturn ONLY the executable SQL/Database query code. No explanations.`,
      },
      { role: 'user', content: prompt },
    ]
    const resp = await this.chat(messages, { temperature: 0.0 })
    let query = resp.content.trim()
    const match = query.match(/```(?:sql|mongodb|json)?\s*([\s\S]*?)```/)
    if (match) query = match[1]!.trim()
    return query
  }

  async classifyIntent(message: string): Promise<{ intent: string; confidence: number }> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Classify user database request intent into one of: [QUERY, SCHEMA_EXPLANATION, GENERAL_QUESTION, REPORT_REQUEST]. Return JSON: {"intent": string, "confidence": number}.',
      },
      { role: 'user', content: message },
    ]
    return this.generateStructuredOutput<{ intent: string; confidence: number }>(messages)
  }

  async analyzeResults(query: string, results: Record<string, unknown>[]): Promise<string> {
    const sample = results.slice(0, 10)
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'Provide a concise, professional executive summary of query results for a business audience.',
      },
      {
        role: 'user',
        content: `Query: ${query}\nSample Results (${results.length} total rows):\n${JSON.stringify(sample, null, 2)}`,
      },
    ]
    const resp = await this.chat(messages, { temperature: 0.2 })
    return resp.content
  }

  async healthCheck(): Promise<boolean> {
    return AIProviderHealthService.isProviderHealthy(this.name)
  }
}
