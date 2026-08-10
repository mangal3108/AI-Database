import { ApiKeysClient } from '@/components/settings/api-keys-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Keys — Internite AI',
}

export default function ApiKeysPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Developer API Keys</h1>
        <p className="text-muted-foreground mt-1">Manage secret keys for programmatic query and database management access.</p>
      </div>

      <ApiKeysClient />
    </div>
  )
}
