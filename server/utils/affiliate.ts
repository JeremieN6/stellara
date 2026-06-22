import { randomBytes, randomUUID } from 'node:crypto'
import { and, count, desc, eq, sql } from 'drizzle-orm'
import { affiliateAdminActions, affiliateClicks, affiliates, affiliateSales } from '../../db/schema'
import { getDbOrThrow } from './db'

export const AFFILIATE_COOKIE_NAME = 'stellara_ref'

export function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
}

export function generateAffiliateSecretToken(): string {
  return randomBytes(32).toString('hex')
}

export async function findActiveAffiliateBySlug(slug: string) {
  const db = getDbOrThrow()
  const normalizedSlug = normalizeSlug(slug)
  if (!normalizedSlug) return null

  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(and(eq(affiliates.slug, normalizedSlug), eq(affiliates.active, true)))
    .limit(1)

  return affiliate || null
}

export async function trackAffiliateClick(slug: string, referrer?: string | null) {
  const db = getDbOrThrow()
  const affiliate = await findActiveAffiliateBySlug(slug)
  if (!affiliate) return null

  await db.insert(affiliateClicks).values({
    affiliateId: affiliate.id,
    referrer: referrer || null,
  })

  return affiliate
}

export async function createAffiliateSaleFromCheckout(payload: {
  affiliateId: string
  stripeSessionId: string
  stripeSubscriptionId?: string | null
  amountCents: number
  productType: string
}) {
  const db = getDbOrThrow()
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, payload.affiliateId))
    .limit(1)

  if (!affiliate) return { created: false, reason: 'affiliate_not_found' }

  const commissionCents = Math.round(payload.amountCents * affiliate.commissionRate)

  await db
    .insert(affiliateSales)
    .values({
      id: randomUUID(),
      affiliateId: affiliate.id,
      stripeSessionId: payload.stripeSessionId,
      stripeSubscriptionId: payload.stripeSubscriptionId || null,
      recurrenceCount: 1,
      amountCents: payload.amountCents,
      commissionCents,
      productType: payload.productType,
      status: 'confirmed',
    })
    .onConflictDoNothing({
      target: affiliateSales.stripeSessionId,
    })

  return { created: true, commissionCents }
}

function addMonths(baseDate: Date, months: number): Date {
  const date = new Date(baseDate)
  date.setMonth(date.getMonth() + months)
  return date
}

function resolveRecurringWindowMonths(): number {
  const config = useRuntimeConfig()
  const raw = Number(config.affiliateRecurringWindowMonths || 6)
  if (!Number.isFinite(raw)) return 6
  return Math.min(24, Math.max(1, Math.floor(raw)))
}

export async function createAffiliateRecurringSaleFromInvoice(payload: {
  stripeInvoiceId: string
  stripeSubscriptionId: string
  amountCents: number
  issuedAt?: Date | null
  productType?: string
}) {
  if (!payload.stripeInvoiceId || !payload.stripeSubscriptionId || payload.amountCents <= 0) {
    return { created: false, reason: 'invalid_payload' }
  }

  const db = getDbOrThrow()

  const [existingInvoiceSale] = await db
    .select({ id: affiliateSales.id })
    .from(affiliateSales)
    .where(eq(affiliateSales.stripeInvoiceId, payload.stripeInvoiceId))
    .limit(1)

  if (existingInvoiceSale) {
    return { created: false, reason: 'already_exists' }
  }

  const [firstSale] = await db
    .select({
      affiliateId: affiliateSales.affiliateId,
      createdAt: affiliateSales.createdAt,
    })
    .from(affiliateSales)
    .where(eq(affiliateSales.stripeSubscriptionId, payload.stripeSubscriptionId))
    .orderBy(affiliateSales.createdAt)
    .limit(1)

  if (!firstSale) {
    return { created: false, reason: 'missing_subscription_attribution' }
  }

  const recurringWindowMonths = resolveRecurringWindowMonths()
  const windowEnd = addMonths(firstSale.createdAt, recurringWindowMonths)
  const referenceDate = payload.issuedAt || new Date()

  if (referenceDate > windowEnd) {
    return { created: false, reason: 'outside_commission_window' }
  }

  const [affiliate] = await db
    .select({ id: affiliates.id, commissionRate: affiliates.commissionRate })
    .from(affiliates)
    .where(eq(affiliates.id, firstSale.affiliateId))
    .limit(1)

  if (!affiliate) {
    return { created: false, reason: 'affiliate_not_found' }
  }

  const [recurrenceRow] = await db
    .select({ count: count(affiliateSales.id) })
    .from(affiliateSales)
    .where(and(
      eq(affiliateSales.stripeSubscriptionId, payload.stripeSubscriptionId),
      eq(affiliateSales.status, 'confirmed'),
      sql`${affiliateSales.stripeInvoiceId} IS NOT NULL`,
    ))

  const recurrenceCount = Number(recurrenceRow?.count || 0) + 1
  const commissionCents = Math.round(payload.amountCents * affiliate.commissionRate)

  await db
    .insert(affiliateSales)
    .values({
      id: randomUUID(),
      affiliateId: affiliate.id,
      stripeSessionId: null,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      stripeInvoiceId: payload.stripeInvoiceId,
      recurrenceCount,
      amountCents: payload.amountCents,
      commissionCents,
      productType: payload.productType || 'orbite_premium',
      status: 'confirmed',
    })
    .onConflictDoNothing({ target: affiliateSales.stripeInvoiceId })

  return { created: true, commissionCents, recurrenceCount }
}

export function buildAffiliatePrivateDashboardUrl(slug: string, secretToken: string): string {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = String(runtimeConfig.public.siteUrl || runtimeConfig.public.appUrl || '').replace(/\/$/, '')
  return `${siteUrl}/affilie/${slug}?token=${secretToken}`
}

export async function getAffiliateInviteStatus(affiliateId: string): Promise<'sent' | 'failed' | 'never_sent'> {
  const db = getDbOrThrow()

  const [latestInvite] = await db
    .select({ action: affiliateAdminActions.action, status: affiliateAdminActions.status })
    .from(affiliateAdminActions)
    .where(and(
      eq(affiliateAdminActions.affiliateId, affiliateId),
      sql`${affiliateAdminActions.action} IN ('invite_sent', 'invite_failed', 'invite_resent')`,
    ))
    .orderBy(desc(affiliateAdminActions.createdAt))
    .limit(1)

  if (!latestInvite) return 'never_sent'
  if (latestInvite.action === 'invite_failed' || latestInvite.status === 'failed') return 'failed'
  return 'sent'
}

export async function getAffiliatePublicDashboard(slug: string) {
  const db = getDbOrThrow()
  const affiliate = await findActiveAffiliateBySlug(slug)
  if (!affiliate) return null

  const [clickStats, salesStats] = await Promise.all([
    db
      .select({ totalClicks: count(affiliateClicks.id) })
      .from(affiliateClicks)
      .where(eq(affiliateClicks.affiliateId, affiliate.id)),
    db
      .select({
        confirmedSales: sql<number>`count(*) FILTER (WHERE ${affiliateSales.status} = 'confirmed')`,
        totalCommissions: sql<number>`coalesce(sum(${affiliateSales.commissionCents}) FILTER (WHERE ${affiliateSales.status} = 'confirmed'), 0)`,
      })
      .from(affiliateSales)
      .where(eq(affiliateSales.affiliateId, affiliate.id)),
  ])

  const recentSales = await db
    .select({
      id: affiliateSales.id,
      createdAt: affiliateSales.createdAt,
      amountCents: affiliateSales.amountCents,
      commissionCents: affiliateSales.commissionCents,
      productType: affiliateSales.productType,
      status: affiliateSales.status,
    })
    .from(affiliateSales)
    .where(eq(affiliateSales.affiliateId, affiliate.id))
    .orderBy(desc(affiliateSales.createdAt))
    .limit(30)

  const totalClicks = Number(clickStats[0]?.totalClicks || 0)
  const confirmedSales = Number(salesStats[0]?.confirmedSales || 0)
  const totalCommissions = Number(salesStats[0]?.totalCommissions || 0)
  const conversionRate = totalClicks > 0 ? confirmedSales / totalClicks : 0

  return {
    _secretToken: affiliate.secretToken,
    affiliate: {
      slug: affiliate.slug,
      name: affiliate.name,
      promoCode: affiliate.promoCode,
      shareLink: `${String(useRuntimeConfig().public.siteUrl || '').replace(/\/$/, '')}/?ref=${affiliate.slug}`,
    },
    metrics: {
      totalClicks,
      confirmedSales,
      totalCommissions,
      conversionRate,
    },
    recentSales: recentSales.map((sale) => ({
      ...sale,
      createdAt: sale.createdAt.toISOString(),
    })),
  }
}

export async function getAdminAffiliatesDashboard() {
  const db = getDbOrThrow()
  const siteUrl = String(useRuntimeConfig().public.siteUrl || useRuntimeConfig().public.appUrl || '').replace(/\/$/, '')

  const rows = await db
    .select({
      id: affiliates.id,
      slug: affiliates.slug,
      name: affiliates.name,
      email: affiliates.email,
      promoCode: affiliates.promoCode,
      commissionRate: affiliates.commissionRate,
      active: affiliates.active,
      secretToken: affiliates.secretToken,
      createdAt: affiliates.createdAt,
    })
    .from(affiliates)
    .orderBy(desc(affiliates.createdAt))

  const affiliateMetrics = await Promise.all(rows.map(async (row) => {
    const [clickRow, salesRow] = await Promise.all([
      db
        .select({ totalClicks: count(affiliateClicks.id) })
        .from(affiliateClicks)
        .where(eq(affiliateClicks.affiliateId, row.id)),
      db
        .select({
          confirmedSales: sql<number>`count(*) FILTER (WHERE ${affiliateSales.status} = 'confirmed')`,
          totalCommissions: sql<number>`coalesce(sum(${affiliateSales.commissionCents}) FILTER (WHERE ${affiliateSales.status} = 'confirmed'), 0)`,
        })
        .from(affiliateSales)
        .where(eq(affiliateSales.affiliateId, row.id)),
    ])

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      email: row.email,
      promoCode: row.promoCode,
      commissionRate: row.commissionRate,
      active: row.active,
      createdAt: row.createdAt,
      privateDashboardUrl: buildAffiliatePrivateDashboardUrl(row.slug, row.secretToken),
      inviteStatus: await getAffiliateInviteStatus(row.id),
      totalClicks: Number(clickRow[0]?.totalClicks || 0),
      confirmedSales: Number(salesRow[0]?.confirmedSales || 0),
      totalCommissions: Number(salesRow[0]?.totalCommissions || 0),
    }
  }))

  const globalCommissions = affiliateMetrics.reduce((acc, row) => acc + Number(row.totalCommissions || 0), 0)

  return {
    affiliates: affiliateMetrics.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
    globalCommissions,
  }
}
