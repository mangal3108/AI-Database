import { WebhooksClient } from '@/components/settings/webhooks-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Webhook Management — Internite AI',
}

export default function WebhooksPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Webhook Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Configure automated HTTP webhooks for real-time database query and billing events.</p>
      </div>

      <WebhooksClient />
    </div>
  )
}
