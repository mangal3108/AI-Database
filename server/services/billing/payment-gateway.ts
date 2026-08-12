/**
 * PAYMENT GATEWAY INTERFACE
 * Abstract payment gateway for multi-provider support
 */

import { prisma } from '@/lib/prisma'
import { RazorpayPaymentGateway } from './providers/razorpay-gateway'
export * from './payment-types'
import type { CreateCheckoutParams, CheckoutResult, CustomerResult, SubscriptionResult, WebhookEventResult } from './payment-types'
import { PaymentGateway } from './payment-types'

/**
 * Mock Payment Gateway for development
 */
export class MockPaymentGateway extends PaymentGateway {
  getProviderName(): string { return 'mock' }
  isConfigured(): boolean { return false }

  async createCustomer(organizationId: string, email: string): Promise<CustomerResult> {
    const existing = await prisma.billingCustomer.findUnique({ where: { organizationId } })
    if (existing) return { customerId: existing.id, email: existing.email }
    const customer = await prisma.billingCustomer.create({ data: { organizationId, email } })
    return { customerId: customer.id, email }
  }

  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const sessionId = `cs_mock_${Date.now()}_${params.planSlug}`
    return { sessionId, url: `${params.successUrl}&session_id=${sessionId}&plan=${params.planSlug}` }
  }

  async createPortalSession(organizationId: string, returnUrl: string): Promise<{ url: string }> {
    return { url: `${returnUrl}?portal=active` }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await prisma.subscription.updateMany({
      where: { razorpaySubscriptionId: subscriptionId },
      data: { cancelAtPeriodEnd: true, canceledAt: new Date() },
    })
  }

  async resumeSubscription(subscriptionId: string): Promise<void> {
    await prisma.subscription.updateMany({
      where: { razorpaySubscriptionId: subscriptionId },
      data: { cancelAtPeriodEnd: false, canceledAt: null },
    })
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    const sub = await prisma.subscription.findFirst({
      where: { OR: [{ razorpaySubscriptionId: subscriptionId }, { id: subscriptionId }] },
    })
    if (!sub) throw new Error('Subscription not found')
    return { subscriptionId: sub.id, status: sub.status, currentPeriodStart: sub.currentPeriodStart, currentPeriodEnd: sub.currentPeriodEnd }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return process.env.NODE_ENV === 'development' || signature === 'mock_signature'
  }

  parseWebhookEvent(payload: string): WebhookEventResult {
    const event = JSON.parse(payload)
    return { eventId: event.id || `${Date.now()}`, eventType: event.event || event.type || 'unknown', data: event.payload || event.data || {} }
  }
}

// Lazy singleton
let _paymentGateway: PaymentGateway | null = null
export function getPaymentGateway(): PaymentGateway {
  if (_paymentGateway) return _paymentGateway
  const provider = process.env.PAYMENT_PROVIDER || 'razorpay'
  if (provider === 'razorpay' && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      _paymentGateway = new RazorpayPaymentGateway()
    } catch { /* fall through */ }
  }
  if (!_paymentGateway) {
    _paymentGateway = new MockPaymentGateway()
  }
  return _paymentGateway
}
