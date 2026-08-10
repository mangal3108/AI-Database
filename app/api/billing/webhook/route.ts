import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubscriptionService } from '@/server/services/billing/subscription-service'
import type { Prisma } from '@prisma/client'
import crypto from 'crypto'

/**
 * BILLING WEBHOOK HANDLER
 * Handles webhook events from payment providers (Razorpay, Stripe)
 *
 * SECURITY MEASURES:
 * 1. Raw request body read BEFORE parsing
 * 2. Signature verification using timing-safe comparison
 * 3. Idempotency check to prevent duplicate processing
 * 4. Server-side plan lookup (never trust frontend data)
 */

function verifyRazorpaySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  } catch {
    return false
  }
}

function verifyStripeSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')

    const sigBuffer = Buffer.from(signature.startsWith('v1=') ? signature.slice(3) : signature)
    return crypto.timingSafeEqual(sigBuffer, Buffer.from(expectedSignature))
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const razorpaySig = req.headers.get('x-razorpay-signature')
    const stripeSig = req.headers.get('stripe-signature')

    const isRazorpay = Boolean(razorpaySig)
    const isStripe = Boolean(stripeSig)

    const skipVerification = process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_VERIFICATION === 'true'

    if (!skipVerification) {
      if (isRazorpay && razorpaySig) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET
        if (secret && !verifyRazorpaySignature(rawBody, razorpaySig, secret)) {
          return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
        }
      } else if (isStripe && stripeSig) {
        const secret = process.env.STRIPE_WEBHOOK_SECRET
        if (secret && !verifyStripeSignature(rawBody, stripeSig, secret)) {
          return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
        }
      } else {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
      }
    }

    let event: Record<string, unknown>
    try {
      event = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid payload JSON' }, { status: 400 })
    }

    const eventId = (event.id as string) ?? `${event.event}_${Date.now()}`
    const eventType = (event.event ?? event.type) as string

    console.log(`[WEBHOOK] Received event: ${eventType} (${eventId})`)

    const existing = await prisma.webhookEvent.findUnique({ where: { eventId } })
    if (existing?.processed) {
      console.log(`[WEBHOOK] Duplicate event ignored: ${eventId}`)
      return NextResponse.json({ received: true, duplicate: true })
    }

    await prisma.webhookEvent.upsert({
      where: { eventId },
      create: { eventId, type: eventType, payload: event as Prisma.InputJsonValue, processed: true },
      update: { processed: true },
    })

    try {
      await processEvent(eventType, event, isRazorpay)
    } catch (processError) {
      console.error(`[WEBHOOK] Error processing event ${eventType}:`, processError)
    }

    return NextResponse.json({ received: true, eventId })
  } catch (err) {
    console.error('[WEBHOOK] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processEvent(eventType: string, event: Record<string, unknown>, isRazorpay: boolean): Promise<void> {
  let metadata: Record<string, string> = {}
  let organizationId = ''

  if (isRazorpay) {
    const payload = event.payload as Record<string, Record<string, unknown> | undefined> | undefined
    const subEntity = payload?.subscription as { entity?: { metadata?: Record<string, string> } } | undefined
    const payEntity = payload?.payment as { entity?: { metadata?: Record<string, string> } } | undefined
    metadata = subEntity?.entity?.metadata ?? payEntity?.entity?.metadata ?? {}
  } else {
    const dataObj = event.data as Record<string, unknown> | undefined
    metadata = (dataObj?.metadata as Record<string, string>) ?? {}
  }

  organizationId = metadata.organizationId ?? ''

  if (!organizationId) {
    console.log('[WEBHOOK] No organizationId in metadata, skipping')
    return
  }

  console.log(`[WEBHOOK] Processing ${eventType} for organization: ${organizationId}`)

  switch (eventType) {
    case 'subscription.created':
    case 'subscription.activated': {
      const planSlug = metadata.planSlug || 'starter'
      await SubscriptionService.activateSubscription(organizationId, planSlug)
      break
    }

    case 'subscription.updated': {
      let status = ''
      if (isRazorpay) {
        const payload = event.payload as Record<string, Record<string, unknown> | undefined> | undefined
        const subEntity = payload?.subscription as { entity?: { status?: string; metadata?: Record<string, string> } } | undefined
        status = subEntity?.entity?.status ?? ''
        const planSlug = subEntity?.entity?.metadata?.planSlug || 'starter'
        if (status === 'cancelled' || status === 'completed') {
          await SubscriptionService.cancelSubscription(organizationId)
        } else if (status === 'active') {
          await SubscriptionService.activateSubscription(organizationId, planSlug)
        }
      } else {
        const dataObj = event.data as Record<string, unknown> | undefined
        status = (dataObj?.status as string) ?? ''
        if (status === 'canceled') {
          await SubscriptionService.cancelSubscription(organizationId)
        }
      }
      break
    }

    case 'subscription.cancelled':
    case 'subscription.completed': {
      await SubscriptionService.cancelSubscription(organizationId)
      break
    }

    case 'subscription.paused':
    case 'subscription.halted': {
      await prisma.subscription.updateMany({
        where: { organizationId },
        data: { status: 'PAST_DUE' },
      })
      break
    }

    case 'subscription.resumed': {
      await prisma.subscription.updateMany({
        where: { organizationId },
        data: { status: 'ACTIVE' },
      })
      break
    }

    case 'payment.captured':
    case 'payment.authorized': {
      if (isRazorpay) {
        const payload = event.payload as Record<string, Record<string, unknown> | undefined> | undefined
        const payEntity = payload?.payment as { entity?: Record<string, unknown> } | undefined
        const paymentId = (payEntity?.entity?.id as string) ?? ''
        const amount = ((payEntity?.entity?.amount as number) ?? 0) / 100
        const currency = (payEntity?.entity?.currency as string) || 'INR'
        const method = (payEntity?.entity?.method as string) ?? null
        const orderId = (payEntity?.entity?.order_id as string) ?? null

        if (paymentId) {
          await prisma.payment.upsert({
            where: { razorpayPaymentId: paymentId },
            create: {
              organizationId,
              amount,
              currency,
              status: 'SUCCEEDED',
              razorpayPaymentId: paymentId,
              razorpayOrderId: orderId,
              paymentMethod: method,
            },
            update: { status: 'SUCCEEDED' },
          })
        }
      }
      break
    }

    case 'payment.failed': {
      if (isRazorpay) {
        const payload = event.payload as Record<string, Record<string, unknown> | undefined> | undefined
        const payEntity = payload?.payment as { entity?: Record<string, unknown> } | undefined
        const paymentId = (payEntity?.entity?.id as string) ?? ''
        const amount = ((payEntity?.entity?.amount as number) ?? 0) / 100
        const currency = (payEntity?.entity?.currency as string) || 'INR'
        const errorDesc = (payEntity?.entity?.error_description as string) ?? null

        if (paymentId) {
          await prisma.payment.upsert({
            where: { razorpayPaymentId: paymentId },
            create: {
              organizationId,
              amount,
              currency,
              status: 'FAILED',
              razorpayPaymentId: paymentId,
              failureReason: errorDesc,
            },
            update: { status: 'FAILED', failureReason: errorDesc },
          })
        }
      }
      break
    }

    default:
      console.log(`[WEBHOOK] Unhandled event: ${eventType}`)
  }
}
