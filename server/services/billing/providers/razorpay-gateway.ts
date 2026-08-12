/**
 * RAZORPAY PAYMENT GATEWAY IMPLEMENTATION
 * Implements PaymentGateway interface for Razorpay
 */

import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import {
  PaymentGateway,
  CreateCheckoutParams,
  CheckoutResult,
  CustomerResult,
  SubscriptionResult,
} from '../payment-types'

export class RazorpayPaymentGateway extends PaymentGateway {
  private keyId: string
  private keySecret: string
  private webhookSecret: string
  private apiUrl = 'https://api.razorpay.com/v1'

  constructor() {
    super()
    this.keyId = process.env.RAZORPAY_KEY_ID || ''
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || ''
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
  }

  getProviderName(): string { return 'razorpay' }

  isConfigured(): boolean {
    return Boolean(this.keyId && this.keySecret)
  }

  private authHeader(): string {
    return `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')}`
  }

  private async apiRequest<T>(method: string, endpoint: string, body?: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: this.authHeader(),
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await response.json() as { error?: { code: string; description: string } }
    if (!response.ok) {
      throw new Error(data.error?.description || `Razorpay API error: ${response.status}`)
    }
    return data as T
  }

  async createCustomer(organizationId: string, email: string): Promise<CustomerResult> {
    const existing = await prisma.billingCustomer.findUnique({ where: { organizationId } })
    if (existing?.razorpayCustomerId) {
      return { customerId: existing.razorpayCustomerId, email }
    }
    const customer = await this.apiRequest<{ id: string }>('POST', '/customers', {
      email,
      notes: { organizationId },
    })
    await prisma.billingCustomer.upsert({
      where: { organizationId },
      create: { organizationId, email, razorpayCustomerId: customer.id },
      update: { razorpayCustomerId: customer.id },
    })
    return { customerId: customer.id, email }
  }

  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const plan = await prisma.plan.findUnique({ where: { slug: params.planSlug } })
    if (!plan) throw new Error(`Plan not found: ${params.planSlug}`)

    const price = params.billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly
    if (price === 0) throw new Error('Free plan does not require checkout')

    const customer = await this.createCustomer(params.organizationId, 'user@example.com')

    // Convert to paisa for INR
    const amountPaisa = price * 100
    const currency = process.env.DEFAULT_CURRENCY || 'INR'

    const order = await this.apiRequest<{ id: string; short_url: string }>('POST', '/orders', {
      amount: amountPaisa,
      currency,
      customer_id: customer.customerId,
      notes: {
        organizationId: params.organizationId,
        planSlug: params.planSlug,
      },
    })

    return {
      sessionId: order.id,
      url: order.short_url,
    }
  }

  async createPortalSession(organizationId: string, returnUrl: string): Promise<{ url: string }> {
    return { url: returnUrl }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.apiRequest('POST', `/subscriptions/${subscriptionId}/cancel`, {
      cancel_at_cycle_end: true,
    })
  }

  async resumeSubscription(subscriptionId: string): Promise<void> {
    await this.apiRequest('POST', `/subscriptions/${subscriptionId}/resume`, {})
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    const sub = await this.apiRequest<{
      id: string
      status: string
      current_start: number
      current_end: number
    }>('GET', `/subscriptions/${subscriptionId}`)

    return {
      subscriptionId: sub.id,
      status: sub.status,
      currentPeriodStart: new Date(sub.current_start * 1000),
      currentPeriodEnd: new Date(sub.current_end * 1000),
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.webhookSecret) return false
    try {
      const expected = crypto.createHmac('sha256', this.webhookSecret).update(payload, 'utf8').digest('hex')
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    } catch {
      return false
    }
  }

  parseWebhookEvent(payload: string): { eventId: string; eventType: string; data: Record<string, unknown> } {
    const event = JSON.parse(payload) as {
      event: string
      payload: Record<string, { entity?: Record<string, unknown> }>
      created_at: number
    }
    return {
      eventId: `${event.event}_${event.created_at}`,
      eventType: event.event,
      data: event.payload as Record<string, unknown>,
    }
  }
}

let instance: RazorpayPaymentGateway | null = null

export function getRazorpayGateway(): RazorpayPaymentGateway {
  if (!instance) instance = new RazorpayPaymentGateway()
  return instance
}
