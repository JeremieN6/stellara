import Stripe from 'stripe'

let stripeClient: Stripe | null = null
let stripeClientKey = ''

export function getStripeOrThrow(event?: Parameters<typeof useRuntimeConfig>[0]) {
  const config = useRuntimeConfig(event)
  const secretKey = String(config.stripeSecretKey || '').trim()

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe secret key is not configured. Set STRIPE_SECRET_KEY (or legacy STRIPE_SK).',
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
