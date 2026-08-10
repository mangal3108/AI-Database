/**
 * PAYMENT GATEWAY INTERFACE
 * Abstract payment gateway for multi-provider support
 */

import { prisma } from '@/lib/prisma'

export interface CreateCheckoutParams {
  organizationId: string
  planSlug: string
  billingCycle: 'monthly' | 'yearly'
  successUrl: string
  cancelUrl: string
}

export interface CheckoutResult {
  sessionId: string
  url: string
}

export interface CustomerResult {
  customerId: string
  email: string
}

export interface SubscriptionResult {
  subscriptionId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
}

export interface PaymentResult {
  paymentId: string
  status: 'captured' | 'failed' | 'pending'
  amount: number
  currency: string
}

export interface WebhookEventResult {
  eventId: string
  eventType: string
  data: Record<string, unknown>
}

export abstract class PaymentGateway {
  abstract getProviderName(): string
  abstract isConfigured(): boolean
  abstract createCustomer(organizationId: string, email: string): Promise<CustomerResult>
  abstract createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult>
  abstract createPortalSession(organizationId: string, returnUrl: string): Promise<{ url: string }>
  abstract cancelSubscription(subscriptionId: string): Promise<void>
  abstract resumeSubscription(subscriptionId: string): Promise<void>
  abstract getSubscription(subscriptionId: string): Promise<SubscriptionResult>
  abstract verifyWebhookSignature(payload: string, signature: string): boolean
  abstract parseWebhookEvent(payload: string): WebhookEventResult
}

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
      const { RazorpayPaymentGateway } = require('./providers/razorpay-gateway')
      _paymentGateway = new RazorpayPaymentGateway()
    } catch { /* fall through */ }
  }
  if (!_paymentGateway) {
    _paymentGateway = new MockPaymentGateway()
  }
  return _paymentGateway
}
