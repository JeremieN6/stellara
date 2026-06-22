import { getStripeOrThrow } from '../../utils/stripe-client'

export default defineEventHandler(async (event) => {
  const sessionId = String(getQuery(event).session_id || '').trim()

  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'session_id query param is required' })
  }

  const stripe = getStripeOrThrow(event)
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  const customerDetails = session.customer_details
  const customerEmail = customerDetails?.email || session.customer_email || null
  const customerName = customerDetails?.name || null
  const metadata = session.metadata || {}

  return {
    id: session.id,
    mode: session.mode,
    paymentStatus: session.payment_status,
    status: session.status,
    customerEmail,
    customerName,
    subscriptionId: typeof session.subscription === 'string' ? session.subscription : null,
    reportId: metadata.reportId || null,
    productType: metadata.productType || null,
    billingInterval: metadata.billingInterval || null,
  }
})
