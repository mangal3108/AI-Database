import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { VisualizerClient } from './visualizer-client'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Data Visualizer — Internite',
  description: 'Transform your data into interactive visualizations and clear insights.',
}

export default async function VisualizerPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id } })
  const databases = membership ? await prisma.databaseConnection.findMany({
    where: { organizationId: membership.organizationId, deletedAt: null },
    select: { id: true, name: true, type: true },
    orderBy: { createdAt: 'desc' },
  }) : []

  return <VisualizerClient userId={session.user.id} initialDatabases={databases} />
}
