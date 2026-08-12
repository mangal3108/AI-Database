export interface CreateCheckoutParams {
  organizationId: string
  planSlug: string
  billingCycle: 'monthly' | 'yearly'
  successUrl: string
  cancelUrl: string
}

export interface CheckoutResult { sessionId: string; url: string }
export interface CustomerResult { customerId: string; email: string }
export interface SubscriptionResult { subscriptionId: string; status: string; currentPeriodStart: Date; currentPeriodEnd: Date }
export interface WebhookEventResult { eventId: string; eventType: string; data: Record<string, unknown> }

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
