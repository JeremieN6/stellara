import { eq } from 'drizzle-orm'
import { affiliates } from '../../../../db/schema'
import { assertAdminAccess } from '../../../utils/admin-auth'
import { getDbOrThrow } from '../../../utils/db'
import { buildAffiliatePrivateDashboardUrl, generateAffiliateSecretToken } from '../../../utils/affiliate'
import { normalizeSlug } from '../../../utils/affiliate'
import {
  recordAffiliateAdminAction,
  sendAffiliatePrivateLinkEmail,
} from '../../../utils/affiliate-admin'
import { getStripeOrThrow } from '../../../utils/stripe-client'

type CreateAffiliateRequest = {
  name?: string
  email?: string
  slug?: string
  promoCode?: string
  commissionRate?: number
  buyerDiscountPercent?: number
}

function normalizePromoCode(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
}

function assertEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const stripe = getStripeOrThrow(event)
  const db = getDbOrThrow(event)
  const config = useRuntimeConfig(event)
  const body = await readBody<CreateAffiliateRequest>(event)

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const slug = normalizeSlug(String(body.slug || ''))
  const promoCode = normalizePromoCode(String(body.promoCode || ''))
  const commissionRate = Number.isFinite(Number(body.commissionRate)) ? Number(body.commissionRate) : 0.4
  const requestedBuyerDiscountPercent = Number.isFinite(Number(body.buyerDiscountPercent))
    ? Number(body.buyerDiscountPercent)
    : Number(config.affiliateBuyerDiscountPercent || 10)

  if (!name || !email || !slug || !promoCode) {
    throw createError({ statusCode: 400, statusMessage: 'name, email, slug et promoCode sont requis.' })
  }

  if (!assertEmail(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email invalide.' })
  }

  if (commissionRate <= 0 || commissionRate > 1) {
    throw createError({ statusCode: 400, statusMessage: 'commissionRate doit etre entre 0 et 1.' })
  }

  if (requestedBuyerDiscountPercent <= 0 || requestedBuyerDiscountPercent >= 100) {
    throw createError({ statusCode: 400, statusMessage: 'buyerDiscountPercent doit etre entre 1 et 99.' })
  }

  const [slugExisting] = await db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.slug, slug)).limit(1)
  if (slugExisting) {
    throw createError({ statusCode: 409, statusMessage: 'Ce slug est deja utilise.' })
  }

  const [promoExisting] = await db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.promoCode, promoCode)).limit(1)
  if (promoExisting) {
    throw createError({ statusCode: 409, statusMessage: 'Ce code promo est deja utilise.' })
  }

  const stripeCoupon = await stripe.coupons.create({
    id: promoCode,
    percent_off: requestedBuyerDiscountPercent,
    duration: 'forever',
    name: `Affiliation ${slug}`,
  })

  const secretToken = generateAffiliateSecretToken()

  const [affiliate] = await db.insert(affiliates).values({
    name,
    email,
    slug,
    promoCode,
    stripeCouponId: stripeCoupon.id,
    commissionRate,
    secretToken,
    active: true,
  }).returning()

  const privateDashboardUrl = buildAffiliatePrivateDashboardUrl(slug, secretToken)

  await recordAffiliateAdminAction({
    affiliateId: affiliate.id,
    action: 'affiliate_created',
    status: 'success',
    details: {
      privateDashboardUrl,
      buyerDiscountPercent: requestedBuyerDiscountPercent,
    },
  })

  let emailDelivery = {
    sent: false,
    reason: 'not_attempted',
  }

  try {
    emailDelivery = await sendAffiliatePrivateLinkEmail({
      email,
      name,
      privateDashboardUrl,
    })

    await recordAffiliateAdminAction({
      affiliateId: affiliate.id,
      action: emailDelivery.sent ? 'invite_sent' : 'invite_failed',
      status: emailDelivery.sent ? 'success' : 'failed',
      details: {
        reason: emailDelivery.reason || null,
        privateDashboardUrl,
      },
    })
  } catch (error) {
    console.error('[admin/affiliates] invite email failed:', error)
    emailDelivery = {
      sent: false,
      reason: 'smtp_send_failed',
    }

    await recordAffiliateAdminAction({
      affiliateId: affiliate.id,
      action: 'invite_failed',
      status: 'failed',
      details: {
        reason: emailDelivery.reason,
        privateDashboardUrl,
      },
    })
  }

  return {
    ok: true,
    affiliate: {
      ...affiliate,
      secretToken: undefined,
    },
    privateDashboardUrl,
    emailDelivery,
    buyerDiscountPercent: requestedBuyerDiscountPercent,
  }
})
