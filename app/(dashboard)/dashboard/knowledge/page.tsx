import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { KnowledgeClient } from '@/components/knowledge/knowledge-client'

export const metadata: Metadata = { title: 'Knowledge Base — Internite AI' }

export default async function KnowledgePage() {
  const session = await auth()
  const userId = session?.user?.id ?? ''

  const membership = await prisma.membership.findFirst({
    where: { userId },
  })

  const docs = membership
    ? await prisma.knowledgeDocument.findMany({
        where: { organizationId: membership.organizationId },
        select: {
          id: true,
          title: true,
          sourceType: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return <KnowledgeClient initialDocs={docs} />
}
