import type { Metadata } from 'next'
import SettingsClient from './settings-client'

export const metadata: Metadata = {
  title: 'Workspace Settings — Internite AI',
  description: 'Manage workspace profile, security preferences, and team credentials.',
}

export default function SettingsPage() {
  return <SettingsClient />
}