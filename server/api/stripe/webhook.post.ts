import { createHmac, timingSafeEqual } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { invoices, plans, subscriptions, users } from '../../../db/schema'
import { getDbOrThrow } from '../../utils/db'
import { markLeadAsConvertedByEmail } from '../../utils/lead-sequence'

type StripeEvent = {
  type: string
  data?: { object?: Record<string, unknown> }
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function fromUnix(value: unknown): Date | null {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return null
  return new Date(numeric * 1000)
}

function buildSignature(payload: string, timestamp: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`, 'utf8')
    .digest('hex')
}

function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(',').map((chunk) => chunk.trim())
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2)
  const signatures = parts
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3))

  if (!timestamp || signatures.length === 0) return false

  const expected = buildSignature(rawBody, timestamp, secret)
  const expectedBuffer = Buffer.from(expected, 'hex')

  return signatures.some((candidate) => {
    try {
      const candidateBuffer = Buffer.from(candidate, 'hex')
      if (candidateBuffer.length !== expectedBuffer.length) return false
      return timingSafeEqual(candidateBuffer, expectedBuffer)
    } catch {
      return false
    }
  })
}

async function upsertUserByEmail(
  email: string,
  opts: { firstName?: string | null; stripeCustomerId?: string | null },
) {
  const now = new Date()
  const db = getDbOrThrow()

  const setPayload: Partial<typeof users.$inferInsert> = { updatedAt: now }
  if (opts.firstName) setPayload.firstName = opts.firstName
  if (opts.stripeCustomerId) setPayload.stripeCustomerId = opts.stripeCustomerId

  const [user] = await db
    .insert(users)
    .values({
      email,
      firstName: opts.firstName || null,
      stripeCustomerId: opts.stripeCustomerId || null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: setPayload,
    })
    .returning({ id: users.id, email: users.email })

  return user
}

async function findUserIdByStripeCustomer(stripeCustomerId: string): Promise<string | null> {
  const db = getDbOrThrow()
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.stripeCustomerId, stripeCustomerId))
    .limit(1)

  return user?.id || null
}

async function findPlanIdByStripePrice(stripePriceId: string | null): Promise<string | null> {
  if (!stripePriceId) return null

  const db = getDbOrThrow()
  const [plan] = await db
    .select({ id: plans.id })
    .from(plans)
    .where(eq(plans.stripePriceId, stripePriceId))
    .limit(1)

  return plan?.id || null
}

async function upsertSubscription(payload: {
  stripeSubscriptionId: string
  stripeCustomerId: string | null
  stripePriceId: string | null
  status: string | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
}) {
  if (!payload.stripeCustomerId || !payload.status) return

  const userId = await findUserIdByStripeCustomer(payload.stripeCustomerId)
  if (!userId) return

  const db = getDbOrThrow()
  const now = new Date()
  const planId = await findPlanIdByStripePrice(payload.stripePriceId)

  await db
    .insert(subscriptions)
    .values({
      userId,
      planId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      status: payload.status,
      currentPeriodStart: payload.currentPeriodStart,
      currentPeriodEnd: payload.currentPeriodEnd,
      cancelAtPeriodEnd: payload.cancelAtPeriodEnd,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        userId,
        planId,
        status: payload.status,
        currentPeriodStart: payload.currentPeriodStart,
        currentPeriodEnd: payload.currentPeriodEnd,
        cancelAtPeriodEnd: payload.cancelAtPeriodEnd,
        updatedAt: now,
      },
    })
}

async function upsertInvoice(payload: {
  stripeInvoiceId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  amountPaidCents: number | null
  currency: string | null
  status: string | null
  hostedInvoiceUrl: string | null
  issuedAt: Date | null
}) {
  const db = getDbOrThrow()
  const userId = payload.stripeCustomerId ? await findUserIdByStripeCustomer(payload.stripeCustomerId) : null

  let subscriptionId: string | null = null
  if (payload.stripeSubscriptionId) {
    const [subscription] = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, payload.stripeSubscriptionId))
      .limit(1)
    subscriptionId = subscription?.id || null
  }

  await db
    .insert(invoices)
    .values({
      userId,
      subscriptionId,
      stripeInvoiceId: payload.stripeInvoiceId,
      amountPaidCents: payload.amountPaidCents,
      currency: payload.currency || 'eur',
      status: payload.status,
      hostedInvoiceUrl: payload.hostedInvoiceUrl,
      issuedAt: payload.issuedAt,
    })
    .onConflictDoUpdate({
      target: invoices.stripeInvoiceId,
      set: {
        userId,
        subscriptionId,
        amountPaidCents: payload.amountPaidCents,
        currency: payload.currency || 'eur',
        status: payload.status,
        hostedInvoiceUrl: payload.hostedInvoiceUrl,
        issuedAt: payload.issuedAt,
      },
    })
}

async function handleCheckoutCompleted(object: Record<string, unknown>) {
  const email = getString((object.customer_details as Record<string, unknown> | undefined)?.email)
    || getString(object.customer_email)
  const stripeCustomerId = getString(object.customer)

  if (!email) return

  await markLeadAsConvertedByEmail(email.toLowerCase())

  const user = await upsertUserByEmail(email.toLowerCase(), {
    stripeCustomerId,
  })

  const stripeSubscriptionId = getString(object.subscription)
  if (!user || !stripeSubscriptionId) return

  const status = getString(object.status) || 'active'

  await upsertSubscription({
    stripeSubscriptionId,
    stripeCustomerId,
    stripePriceId: null,
    status,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  })
}

async function handleSubscriptionUpdated(object: Record<string, unknown>) {
  const stripeSubscriptionId = getString(object.id)
  const stripeCustomerId = getString(object.customer)
  const status = getString(object.status)
  const currentPeriodStart = fromUnix(object.current_period_start)
  const currentPeriodEnd = fromUnix(object.current_period_end)
  const cancelAtPeriodEnd = Boolean(object.cancel_at_period_end)

  const items = object.items as { data?: Array<{ price?: { id?: unknown } }> } | undefined
  const stripePriceId = getString(items?.data?.[0]?.price?.id)

  if (!stripeSubscriptionId) return

  await upsertSubscription({
    stripeSubscriptionId,
    stripeCustomerId,
    stripePriceId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  })
}

async function handleInvoicePaid(object: Record<string, unknown>) {
  const stripeInvoiceId = getString(object.id)
  if (!stripeInvoiceId) return

  await upsertInvoice({
    stripeInvoiceId,
    stripeCustomerId: getString(object.customer),
    stripeSubscriptionId: getString(object.subscription),
    amountPaidCents: Number.isFinite(Number(object.amount_paid)) ? Number(object.amount_paid) : null,
    currency: getString(object.currency),
    status: getString(object.status),
    hostedInvoiceUrl: getString(object.hosted_invoice_url),
    issuedAt: fromUnix(object.created),
  })
}

async function handleSubscriptionDeleted(object: Record<string, unknown>) {
  const stripeSubscriptionId = getString(object.id)
  if (!stripeSubscriptionId) return

  const db = getDbOrThrow()
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      currentPeriodEnd: fromUnix(object.current_period_end),
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    })
    .where(and(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId)))
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const secret = (config.stripeWebhookSecret || '').trim()

  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'STRIPE_WEBHOOK_SECRET is not configured' })
  }

  const signatureHeader = getHeader(event, 'stripe-signature')
  if (!signatureHeader) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Stripe signature header' })
  }

  const rawBody = await readRawBody(event, 'utf8')
  if (!rawBody) {
    throw createError({ statusCode: 400, statusMessage: 'Missing request body' })
  }

  const isValid = verifyStripeSignature(rawBody, signatureHeader, secret)
  if (!isValid) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Stripe signature' })
  }

  let stripeEvent: StripeEvent
  try {
    stripeEvent = JSON.parse(rawBody) as StripeEvent
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Stripe payload JSON' })
  }

  const object = stripeEvent.data?.object
  if (!object || typeof object !== 'object') {
    return { received: true, ignored: true }
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(object)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(object)
      break
    case 'invoice.paid':
      await handleInvoicePaid(object)
      break
    default:
      break
  }

  return { received: true }
})
