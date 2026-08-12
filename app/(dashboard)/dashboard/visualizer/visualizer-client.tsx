'use client'

import { VisualizerWorkspace } from '@/components/visualization/visualizer-workspace'

interface VisualizerClientProps {
  userId: string
  initialDatabases: Array<{ id: string; name: string; type: string }>
}

export function VisualizerClient({ userId, initialDatabases }: VisualizerClientProps) {
  return <VisualizerWorkspace userId={userId} initialDatabases={initialDatabases} />
}
