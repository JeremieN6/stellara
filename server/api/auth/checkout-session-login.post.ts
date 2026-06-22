import { getStripeOrThrow } from '../../utils/stripe-client'
import { setAccountSessionCookie } from '../../utils/auth-session'

interface CheckoutSessionLoginRequest {
  sessionId?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CheckoutSessionLoginRequest>(event)
  const sessionId = String(body.sessionId || '').trim()

  if (!sessionId) {
    throw createError({ statusCode: 400, statusMessage: 'sessionId is required' })
  }

  const stripe = getStripeOrThrow(event)
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  const customerEmail = (session.customer_details?.email || session.customer_email || '').trim().toLowerCase()

  if (!customerEmail) {
    throw createError({ statusCode: 400, statusMessage: 'No customer email found in checkout session' })
  }

  const completed = session.status === 'complete'
  const paid = session.payment_status === 'paid' || session.mode === 'subscription'
  if (!completed || !paid) {
    throw createError({ statusCode: 400, statusMessage: 'Checkout session is not completed/paid yet' })
  }

  setAccountSessionCookie(event, customerEmail)

  return {
    ok: true,
    email: customerEmail,
  }
})
