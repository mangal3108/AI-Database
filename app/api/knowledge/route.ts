import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantContext } from '@/server/services/auth/tenant-context'
import { z } from 'zod'

const createKnowledgeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  sourceType: z.enum(['SCHEMA_AUTO', 'BUSINESS_GLOSSARY', 'USER_DOCUMENT', 'SAVED_QUERY', 'MANUAL_ENTRY']).default('MANUAL_ENTRY'),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await getTenantContext(session.user.id)
  const docs = await prisma.knowledgeDocument.findMany({
    where: { organizationId: tenant.organizationId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ docs })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await getTenantContext(session.user.id)
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createKnowledgeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
  }

  try {
    const doc = await prisma.knowledgeDocument.create({
      data: {
        organizationId: tenant.organizationId,
        title: parsed.data.title,
        sourceType: parsed.data.sourceType as any,
        status: 'READY',
        chunkCount: 1,
      },
    })

    // Create document chunk with content for AI RAG retrieval
    await prisma.knowledgeChunk.create({
      data: {
        organizationId: tenant.organizationId,
        documentId: doc.id,
        content: parsed.data.content,
      },
    })

    return NextResponse.json({ doc }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/knowledge Error]:', err)
    return NextResponse.json({
      error: 'Failed to create knowledge entry',
      message: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}
