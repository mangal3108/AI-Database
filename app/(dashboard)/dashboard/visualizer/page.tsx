import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { VisualizerClient } from './visualizer-client'

export const metadata: Metadata = {
  title: 'Data Visualizer — Internite AI',
  description: 'Transform your data into interactive visualizations and AI-powered insights.',
}

export default async function VisualizerPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  return <VisualizerClient userId={session.user.id} />
}
