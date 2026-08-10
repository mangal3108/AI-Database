import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const session = await auth()
  if (!session) return { title: 'Chat' }

  const membership = await prisma.membership.findFirst({ where: { userId: session.user?.id ?? '' } })
  if (!membership) return { title: 'Chat' }

  const conversation = await prisma.conversation.findFirst({
    where: { id, organizationId: membership.organizationId },
    select: { title: true },
  })

  return { title: conversation?.title ?? 'Chat' }
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session) notFound()

  const membership = await prisma.membership.findFirst({ where: { userId: session.user?.id ?? '' } })
  if (!membership) notFound()

  const conversation = await prisma.conversation.findFirst({
    where: { id, organizationId: membership.organizationId, deletedAt: null },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, role: true, content: true, metadata: true, createdAt: true },
      },
      connection: { select: { id: true, name: true, type: true } },
    },
  })

  if (!conversation) notFound()

  const initialMessages = conversation.messages.map(m => ({
    id: m.id,
    role: m.role as 'USER' | 'ASSISTANT',
    content: m.content,
    metadata: m.metadata as Record<string, unknown> | undefined,
  }))

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center px-6 h-14 border-b border-border/50 flex-shrink-0">
        <h1 className="font-semibold text-foreground text-sm truncate">
          {conversation.title ?? 'Conversation'}
        </h1>
        {conversation.connection && (
          <span className="ml-3 text-xs text-muted-foreground border border-border/50 rounded-lg px-2 py-0.5">
            {conversation.connection.name}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          conversationId={id}
          initialMessages={initialMessages as Parameters<typeof ChatInterface>[0]['initialMessages']}
        />
      </div>
    </div>
  )
}
