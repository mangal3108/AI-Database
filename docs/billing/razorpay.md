# Razorpay Integration Documentation

## Overview

Internite AI integrates with Razorpay for payment processing. This document covers setup, architecture, and troubleshooting.

## Architecture

```
User → Pricing → Checkout API → Razorpay → Webhook → Subscription → Entitlements
                                              ↓
                                        Invoice Service
```

### Payment Flow

1. **Checkout Initiation**
   - User selects plan and billing cycle
   - Frontend calls `POST /api/billing` with `{ action: "checkout", planSlug, billingCycle }`
   - Server validates plan, creates/retrieves customer, creates Razorpay subscription/link
   - Returns checkout URL to frontend
   - User redirected to Razorpay

2. **Payment Processing**
   - User completes payment on Razorpay
   - Payment captured/succeeded

3. **Webhook Processing**
   - Razorpay sends webhook to `/api/billing/webhook`
   - Signature verified (timing-safe HMAC)
   - Idempotency check prevents duplicate processing
   - Subscription status updated
   - Entitlements recalculated
   - Invoice created

4. **Access Granted**
   - User can now access paid features
   - Billing dashboard shows updated subscription

## Environment Variables

### Required

```bash
# Payment Provider
PAYMENT_PROVIDER=razorpay

# Razorpay API Credentials
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX

# Webhook Secret (from Razorpay Dashboard)
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Currency
DEFAULT_CURRENCY=INR
```

### Optional

```bash
# For international currencies (future)
# SUPPORTED_CURRENCIES=INR,USD,EUR,GBP
```

## Setup Instructions

### 1. Create Razorpay Account

1. Sign up at https://dashboard.razorpay.com
2. Complete business verification
3. Obtain API keys from Settings → API Keys

### 2. Configure Webhook

1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `subscription.created`
   - `subscription.activated`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.paused`
   - `subscription.resumed`
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
   - `refund.processed`
4. Copy webhook secret

### 3. Create Plans (if using Razorpay Plans)

Razorpay plans must be created either:
- Manually in Razorpay Dashboard → Plans
- Or they are created on-demand by the application

The application creates plans with IDs like:
- `internite_starter_monthly`
- `internite_pro_yearly`

### 4. Local Development Testing

For local webhook testing, use a tunneling service:

```bash
# Using ngrok
ngrok http 3000

# Set the webhook URL in Razorpay to the ngrok URL
# https://abc123.ngrok.io/api/billing/webhook
```

### 5. Environment Configuration

```bash
# .env.local
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

## Payment Lifecycle

### Subscription States

| Internal State | Description |
|--------------|-------------|
| `ACTIVE` | Subscription is active, user has paid access |
| `TRIALING` | User is in trial period |
| `INCOMPLETE` | Subscription created but not yet activated |
| `PAST_DUE` | Payment failed, grace period active |
| `CANCELED` | Subscription cancelled, access until period end |
| `EXPIRED` | Subscription ended, access revoked |

### Payment States

| Internal State | Description |
|--------------|-------------|
| `PENDING` | Payment initiated |
| `SUCCEEDED` | Payment captured |
| `FAILED` | Payment failed |
| `REFUNDED` | Payment refunded |

### Invoice States

| Internal State | Description |
|--------------|-------------|
| `DRAFT` | Invoice created, not finalized |
| `OPEN` | Invoice sent, awaiting payment |
| `PAID` | Payment received |
| `VOID` | Invoice cancelled |
| `UNCOLLECTIBLE` | Invoice cannot be collected |

## Webhook Events

### Supported Events

| Event | Action |
|-------|--------|
| `subscription.created` | Create subscription record |
| `subscription.activated` | Activate subscription, update entitlements |
| `subscription.updated` | Update subscription details |
| `subscription.cancelled` | Mark for cancellation at period end |
| `subscription.paused` | Mark as PAST_DUE |
| `subscription.resumed` | Reactivate from PAST_DUE |
| `payment.captured` | Record successful payment |
| `payment.failed` | Record failed payment, notify user |
| `refund.created` | Process refund |
| `refund.processed` | Confirm refund completion |

### Webhook Security

1. **Signature Verification**: All webhooks verified with HMAC-SHA256
2. **Idempotency**: Duplicate events detected and ignored
3. **Timing-Safe Comparison**: Prevents timing attacks
4. **Raw Body Parsing**: Body read before any processing

## Testing

### Test Cards

Use Razorpay test cards:
- Success: `4111 1111 1111 1111`, any future expiry, any CVV
- Failure: `4000 0000 0000 0002`

### Test Webhooks

Use Razorpay's webhook test feature in dashboard.

### Manual Testing

```bash
# Create a checkout (development only)
curl -X POST http://localhost:3000/api/billing \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION" \
  -d '{"action":"checkout","planSlug":"pro","billingCycle":"monthly"}'
```

## Troubleshooting

### Common Issues

#### 1. Webhook not receiving events

- Check webhook URL is accessible
- Verify webhook is enabled in dashboard
- Check firewall allows Razorpay IPs
- Review webhook logs in Razorpay dashboard

#### 2. Signature verification failing

- Ensure `RAZORPAY_WEBHOOK_SECRET` is correct
- Check for extra whitespace in secret
- Verify webhook payload isn't being modified by middleware

#### 3. Subscription not activating

- Check webhook is receiving `subscription.activated` event
- Verify organizationId in metadata matches database
- Check entitlement recalculation logs

#### 4. Duplicate events

- Check idempotency is working (eventId unique check)
- Review webhook event table in database

### Logs to Check

```bash
# Application logs
tail -f logs/app.log | grep WEBHOOK

# Webhook-specific
tail -f logs/app.log | grep -E "(WEBHOOK|BILLING|subscription|payment)"
```

## Production Checklist

- [ ] Razorpay account verified
- [ ] API keys set (not test keys)
- [ ] Webhook URL using HTTPS
- [ ] All events subscribed
- [ ] Webhook secret configured
- [ ] Test payment completed
- [ ] Invoice generation verified
- [ ] Email notifications working
- [ ] Error monitoring in place

## Security Considerations

1. **Never expose secrets**: API keys only in environment
2. **Webhook verification**: Always verify signatures
3. **Idempotency**: Prevent duplicate processing
4. **Audit logging**: Record all billing events
5. **Tenant isolation**: Ensure organization-level access control
6. **No client-side activation**: Subscriptions only via webhooks

## Support

- Razorpay Support: https://razorpay.com/support/
- Razorpay Documentation: https://razorpay.com/docs/
- Internite Issues: [GitHub Repository]
