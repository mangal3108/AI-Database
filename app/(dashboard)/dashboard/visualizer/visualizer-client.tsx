'use client'

import { VisualizerWorkspace } from '@/components/visualization/visualizer-workspace'

interface VisualizerClientProps {
  userId: string
}

export function VisualizerClient({ userId }: VisualizerClientProps) {
  return <VisualizerWorkspace userId={userId} />
}
