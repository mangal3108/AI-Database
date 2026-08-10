import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const apiKeys = await prisma.apiKey.findMany({
    where: { organizationId: membership.organizationId, revokedAt: null },
    select: { id: true, name: true, keyPrefix: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ apiKeys })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Only Owners or Admins can create API keys.' }, { status: 403 })
  }

  const { name } = await req.json()
  const rawKey = `int_${crypto.randomBytes(24).toString('hex')}`
  const keyPrefix = rawKey.slice(0, 8)
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')

  const apiKey = await prisma.apiKey.create({
    data: {
      organizationId: membership.organizationId,
      userId: session.user.id,
      name,
      keyHash,
      keyPrefix,
    },
  })

  return NextResponse.json({ apiKey, secretKey: rawKey })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing key ID' }, { status: 400 })

  // SECURITY: Verify API key belongs to user's organization before revoking
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id,
      organizationId: membership.organizationId,
    },
  })

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 404 })
  }

  await prisma.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
