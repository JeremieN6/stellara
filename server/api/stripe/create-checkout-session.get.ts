import { AFFILIATE_COOKIE_NAME, findActiveAffiliateBySlug } from '../../utils/affiliate'
import { getStripeOrThrow } from '../../utils/stripe-client'

type ProductType = 'rapport_complet' | 'orbite_premium'
type BillingInterval = 'monthly' | 'yearly'

function readProductType(value: unknown): ProductType {
  return value === 'orbite_premium' ? 'orbite_premium' : 'rapport_complet'
}

function readBillingInterval(value: unknown): BillingInterval {
  return value === 'yearly' ? 'yearly' : 'monthly'
}

function resolveRequestOrigin(event: Parameters<typeof defineEventHandler>[0], fallbackOrigin: string): string {
  const forwardedProto = String(getHeader(event, 'x-forwarded-proto') || '').trim()
  const forwardedHost = String(getHeader(event, 'x-forwarded-host') || '').trim()
  const host = String(getHeader(event, 'host') || '').trim()

  const originHost = forwardedHost || host
  if (!originHost) return fallbackOrigin

  const protocol = forwardedProto || (originHost.includes('localhost') || originHost.startsWith('127.0.0.1') ? 'http' : 'https')
  return `${protocol}://${originHost}`.replace(/\/$/, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const stripe = getStripeOrThrow(event)
  const query = getQuery(event)

  const productType = readProductType(query.productType)
  const billingInterval = readBillingInterval(query.billingInterval)

  const oneShotPriceId = String(config.stripePriceId || '').trim()
  const monthlyPriceId = String(config.stripePriceIdMonthly || '').trim()
  const yearlyPriceId = String(config.stripePriceIdYearly || '').trim()

  const selectedPriceId = productType === 'rapport_complet'
    ? oneShotPriceId
    : (billingInterval === 'yearly' ? yearlyPriceId : monthlyPriceId)

  if (!selectedPriceId) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe price id is not configured.' })
  }

  if (!selectedPriceId.startsWith('price_')) {
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid Stripe price id: "${selectedPriceId}". Configure STRIPE_PRICE_ID / STRIPE_PRICE_ID_MONTHLY / STRIPE_PRICE_ID_YEARLY with values starting by price_.`,
    })
  }

  const configuredSiteUrl = String(config.public.appUrl || config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  const siteUrl = resolveRequestOrigin(event, configuredSiteUrl)

  const reportId = String(query.reportId || '').trim()
  const email = String(query.email || '').trim().toLowerCase()
  const successParams = new URLSearchParams({ session_id: '{CHECKOUT_SESSION_ID}' })

  if (reportId) successParams.set('report_id', reportId)
  if (email) successParams.set('email', email)

  const successUrl = `${siteUrl}/checkout/success?${successParams.toString()}`
  const cancelUrl = `${siteUrl}/rapport`

  const refSlug = getCookie(event, AFFILIATE_COOKIE_NAME)
  const affiliate = refSlug ? await findActiveAffiliateBySlug(refSlug) : null

  const session = await stripe.checkout.sessions.create({
    mode: productType === 'rapport_complet' ? 'payment' : 'subscription',
    line_items: [{
      price: selectedPriceId,
      quantity: 1,
    }],
    discounts: affiliate ? [{ coupon: affiliate.stripeCouponId }] : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      productType,
      billingInterval,
      affiliateId: affiliate?.id || '',
      affiliateSlug: affiliate?.slug || '',
      reportId,
      email,
    },
  })

  if (!session.url) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to create Stripe checkout URL.' })
  }

  return sendRedirect(event, session.url, 303)
})
