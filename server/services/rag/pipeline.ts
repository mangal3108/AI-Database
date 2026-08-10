import { prisma } from '../../../lib/prisma'
import { getAIProvider } from '../ai'

/**
 * RAG Pipeline for Internite AI
 * 
 * Implements hybrid retrieval: vector similarity + keyword search
 * All knowledge is scoped to organization to ensure tenant isolation.
 */

const CHUNK_SIZE = 500 // characters
const CHUNK_OVERLAP = 50
const MAX_CONTEXT_CHUNKS = 8

export interface KnowledgeChunk {
  content: string
  metadata: Record<string, unknown>
  score?: number
}

/**
 * Chunk text into overlapping segments for embedding.
 */
export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    if (end === text.length) break
    start += chunkSize - overlap
  }

  return chunks
}

/**
 * Index schema information for a database connection into the RAG system.
 * Called after a database is connected and introspected.
 */
export async function indexDatabaseSchema(
  organizationId: string,
  databaseConnectionId: string,
  schemaText: string,
  projectId?: string | null
): Promise<void> {
  const ai = getAIProvider()

  // Create a knowledge document record
  const doc = await prisma.knowledgeDocument.create({
    data: {
      organizationId,
      projectId: projectId ?? null,
      databaseConnectionId,
      title: 'Database Schema',
      sourceType: 'SCHEMA_AUTO',
      status: 'PROCESSING',
    },
  })

  const chunks = chunkText(schemaText)

  for (const chunkContent of chunks) {
    try {
      const { embedding } = await ai.generateEmbedding(chunkContent)

      // Store chunk with embedding, tenant_id, project_id and database_connection_id
      const embeddingString = `[${embedding.join(',')}]`
      const metadataJson = JSON.stringify({ source: 'schema', databaseConnectionId, organizationId, projectId })

      await prisma.$executeRaw`
        INSERT INTO knowledge_chunks (id, "organizationId", "projectId", "documentId", "databaseConnectionId", content, metadata, embedding, "createdAt")
        VALUES (
          ${generateId()},
          ${organizationId},
          ${projectId ?? null},
          ${doc.id},
          ${databaseConnectionId},
          ${chunkContent},
          ${metadataJson}::jsonb,
          ${embeddingString}::vector,
          NOW()
        )
      `
    } catch {
      // Continue indexing even if one chunk fails
    }
  }

  await prisma.knowledgeDocument.update({
    where: { id: doc.id },
    data: { status: 'READY', chunkCount: chunks.length },
  })
}

/**
 * Retrieve relevant knowledge chunks for a user question.
 * Uses hybrid retrieval: vector similarity + keyword matching.
 */
export async function retrieveRelevantChunks(
  organizationId: string,
  databaseConnectionId: string | undefined,
  question: string,
  limit = MAX_CONTEXT_CHUNKS
): Promise<KnowledgeChunk[]> {
  const ai = getAIProvider()

  let embedding: number[]
  try {
    const result = await ai.generateEmbedding(question)
    embedding = result.embedding
  } catch {
    // Fall back to keyword-only search if embedding fails
    return keywordSearch(organizationId, databaseConnectionId, question, limit)
  }

  // Vector similarity search — strictly scoped by organizationId, optional projectId & databaseConnectionId
  const vectorResults = databaseConnectionId
    ? await prisma.$queryRaw<Array<{
        id: string
        content: string
        metadata: Record<string, unknown>
        similarity: number
      }>>`
        SELECT kc.id, kc.content, kc.metadata,
          1 - (kc.embedding <=> ${`[${embedding.join(',')}]`}::vector) as similarity
        FROM knowledge_chunks kc
        WHERE kc."organizationId" = ${organizationId}
          AND kc."databaseConnectionId" = ${databaseConnectionId}
          AND kc.embedding IS NOT NULL
        ORDER BY kc.embedding <=> ${`[${embedding.join(',')}]`}::vector
        LIMIT ${limit * 2}
      `
    : await prisma.$queryRaw<Array<{
        id: string
        content: string
        metadata: Record<string, unknown>
        similarity: number
      }>>`
        SELECT kc.id, kc.content, kc.metadata,
          1 - (kc.embedding <=> ${`[${embedding.join(',')}]`}::vector) as similarity
        FROM knowledge_chunks kc
        WHERE kc."organizationId" = ${organizationId}
          AND kc.embedding IS NOT NULL
        ORDER BY kc.embedding <=> ${`[${embedding.join(',')}]`}::vector
        LIMIT ${limit * 2}
      `

  // Keyword search for exact matches (e.g. specific table/column names)
  const keywordResults = await keywordSearch(organizationId, databaseConnectionId, question, limit)

  // Merge and deduplicate by ID
  const seen = new Set<string>()
  const merged: KnowledgeChunk[] = []

  for (const chunk of [...vectorResults, ...keywordResults]) {
    const id = ('id' in chunk && chunk.id) ? chunk.id : chunk.content.substring(0, 50)
    if (!seen.has(id)) {
      seen.add(id)
      merged.push({
        content: chunk.content,
        metadata: chunk.metadata ?? {},
        score: 'similarity' in chunk ? (chunk.similarity as number) : 0.5,
      })
    }
  }

  // Sort by score and return top results
  return merged
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit)
}

async function keywordSearch(
  organizationId: string,
  databaseConnectionId: string | undefined,
  question: string,
  limit: number
): Promise<KnowledgeChunk[]> {
  try {
    const results = await prisma.$queryRaw<Array<{
      id: string
      content: string
      metadata: Record<string, unknown>
    }>>`
      SELECT kc.id, kc.content, kc.metadata
      FROM knowledge_chunks kc
      WHERE kc."organizationId" = ${organizationId}
        AND kc.content ILIKE ${'%' + question.split(' ').join('%') + '%'}
      LIMIT ${limit}
    `
    return results.map(r => ({ content: r.content, metadata: r.metadata ?? {}, score: 0.5 }))
  } catch {
    return []
  }
}

/**
 * Build context string from retrieved chunks for the AI prompt.
 */
export function buildRagContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return ''

  const sections = chunks.map((chunk, i) =>
    `[Knowledge ${i + 1}]\n${chunk.content}`
  )

  return `RELEVANT KNOWLEDGE:\n${sections.join('\n\n')}\n\nEND OF KNOWLEDGE`
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
