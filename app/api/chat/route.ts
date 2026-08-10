import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { runChatEngine } from '@/server/services/chat/engine'
import { chatMessageSchema } from '@/lib/zod-schemas'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = chatMessageSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  })

  if (!membership) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 403 })
  }

  // Streaming response
  const encoder = new TextEncoder()
  const stream = new TransformStream<Uint8Array, Uint8Array>()
  const writer = stream.writable.getWriter()

  const writeEvent = async (event: string, data: unknown) => {
    const chunk = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    await writer.write(encoder.encode(chunk))
  }

  // Process chat in background while streaming status updates
  ;(async () => {
    try {
      const result = await runChatEngine({
        organizationId: membership.organizationId,
        userId: session.user?.id,
        databaseConnectionId: parsed.data.databaseConnectionId,
        conversationId: parsed.data.conversationId,
        message: parsed.data.message,
        streamCallback: async (status) => {
          await writeEvent('status', { status })
        },
      })

      await writeEvent('result', result)
    } catch (err) {
      await writeEvent('error', {
        message: err instanceof Error ? err.message : 'An error occurred',
      })
    } finally {
      await writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
