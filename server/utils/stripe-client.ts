import Stripe from 'stripe'

let stripeClient: Stripe | null = null
let stripeClientKey = ''

export function getStripeOrThrow(event?: Parameters<typeof useRuntimeConfig>[0]) {
  const config = useRuntimeConfig(event)
  const secretKey = String(config.stripeSecretKey || '').trim()

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'STRIPE_SECRET_KEY is not configured.',
    })
  }

  if (!stripeClient || stripeClientKey !== secretKey) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    })
    stripeClientKey = secretKey
  }

  return stripeClient
}
