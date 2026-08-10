import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ endpoints })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Only Owners or Admins can configure webhooks.' }, { status: 403 })
  }

  const { url } = await req.json()
  const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`

  const endpoint = await prisma.webhookEndpoint.create({
    data: {
      organizationId: membership.organizationId,
      url,
      secret,
      events: ['subscription.updated', 'query.executed', 'invoice.paid'],
    },
  })

  return NextResponse.json({ endpoint })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing endpoint ID' }, { status: 400 })

  // SECURITY: Verify webhook belongs to user's organization before deleting
  const endpoint = await prisma.webhookEndpoint.findFirst({
    where: {
      id,
      organizationId: membership.organizationId,
    },
  })

  if (!endpoint) {
    return NextResponse.json({ error: 'Webhook endpoint not found' }, { status: 404 })
  }

  await prisma.webhookEndpoint.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
