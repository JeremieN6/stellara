import { randomBytes } from 'node:crypto'
import { and, count, desc, eq, sql } from 'drizzle-orm'
import { affiliateAdminActions, affiliateClicks, affiliates, affiliateSales } from '../../db/schema'
import { normalizeSlug } from './affiliate'
import { getDbOrThrow } from './db'
import { sendPreviewEmail } from './mailer'

export type AffiliateInviteStatus = 'sent' | 'failed' | 'never_sent'

export type AffiliateAdminActionStatus = 'success' | 'failed' | 'info'

export type AffiliateAdminActionType =
  | 'affiliate_created'
  | 'invite_sent'
  | 'invite_failed'
  | 'invite_resent'
  | 'token_regenerated'
  | 'affiliate_disabled'
  | 'affiliate_enabled'

export function generateAffiliateSecretToken(): string {
  return randomBytes(32).toString('hex')
}

export async function recordAffiliateAdminAction(input: {
  affiliateId: string
  action: AffiliateAdminActionType
  status: AffiliateAdminActionStatus
  actor?: string
  details?: Record<string, unknown> | string | null
}) {
  const db = getDbOrThrow()
  const details = typeof input.details === 'string'
    ? input.details
    : input.details
      ? JSON.stringify(input.details)
      : null

  await db.insert(affiliateAdminActions).values({
    affiliateId: input.affiliateId,
    actor: input.actor || 'admin',
    action: input.action,
    status: input.status,
    details,
  })
}

export async function sendAffiliatePrivateLinkEmail(input: {
  email: string
  name: string
  privateDashboardUrl: string
}) {
  const payload = {
    to: input.email,
    subject: `Ton accès influenceur Stellara pour ${input.name}`,
    text: [
      `Bonjour ${input.name},`,
      '',
      'Ton tableau de bord influenceur est prêt :',
      input.privateDashboardUrl,
      '',
      'Conserve ce lien précieusement, il est unique et privé.',
    ].join('\n'),
    html: `
      <p>Bonjour ${input.name},</p>
      <p>Ton tableau de bord influenceur Stellara est prêt.</p>
      <p><a href="${input.privateDashboardUrl}">Ouvrir mon tableau de bord privé</a></p>
      <p>Conserve ce lien précieusement, il est unique et privé.</p>
    `,
  }

  return sendPreviewEmail(payload)
}

export async function findAffiliateBySlug(slug: string) {
  const db = getDbOrThrow()
  const normalizedSlug = normalizeSlug(slug)
  if (!normalizedSlug) return null

  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.slug, normalizedSlug))
    .limit(1)

  return affiliate || null
}

export async function getAffiliateAdminDetail(slug: string) {
  const db = getDbOrThrow()
  const affiliate = await findAffiliateBySlug(slug)
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

  const [recentSales, auditEntries] = await Promise.all([
    db
      .select({
        id: affiliateSales.id,
        createdAt: affiliateSales.createdAt,
        amountCents: affiliateSales.amountCents,
        commissionCents: affiliateSales.commissionCents,
        productType: affiliateSales.productType,
        status: affiliateSales.status,
        stripeSessionId: affiliateSales.stripeSessionId,
        stripeSubscriptionId: affiliateSales.stripeSubscriptionId,
        stripeInvoiceId: affiliateSales.stripeInvoiceId,
      })
      .from(affiliateSales)
      .where(eq(affiliateSales.affiliateId, affiliate.id))
      .orderBy(desc(affiliateSales.createdAt))
      .limit(20),
    db
      .select({
        id: affiliateAdminActions.id,
        action: affiliateAdminActions.action,
        status: affiliateAdminActions.status,
        actor: affiliateAdminActions.actor,
        details: affiliateAdminActions.details,
        createdAt: affiliateAdminActions.createdAt,
      })
      .from(affiliateAdminActions)
      .where(eq(affiliateAdminActions.affiliateId, affiliate.id))
      .orderBy(desc(affiliateAdminActions.createdAt))
      .limit(20),
  ])

  const totalClicks = Number(clickStats[0]?.totalClicks || 0)
  const confirmedSales = Number(salesStats[0]?.confirmedSales || 0)
  const totalCommissions = Number(salesStats[0]?.totalCommissions || 0)
  const conversionRate = totalClicks > 0 ? confirmedSales / totalClicks : 0
  const privateDashboardUrl = buildAffiliatePrivateDashboardUrl(affiliate.slug, affiliate.secretToken)

  return {
    affiliate: {
      id: affiliate.id,
      slug: affiliate.slug,
      name: affiliate.name,
      email: affiliate.email,
      promoCode: affiliate.promoCode,
      commissionRate: affiliate.commissionRate,
      active: affiliate.active,
      createdAt: affiliate.createdAt.toISOString(),
      privateDashboardUrl,
      secretToken: affiliate.secretToken,
    },
    metrics: {
      totalClicks,
      confirmedSales,
      totalCommissions,
      conversionRate,
    },
    inviteStatus: await getAffiliateInviteStatus(affiliate.id),
    recentSales: recentSales.map((sale) => ({
      ...sale,
      createdAt: sale.createdAt.toISOString(),
    })),
    auditEntries: auditEntries.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
    })),
  }
}

export function sanitizeAffiliatePrivateDashboardUrl(affiliate: { slug: string; secretToken: string }) {
  return buildAffiliatePrivateDashboardUrl(affiliate.slug, affiliate.secretToken)
}
