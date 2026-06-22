import { eq } from 'drizzle-orm'
import { affiliates } from '../../../../../db/schema'
import { assertAdminAccess } from '../../../../utils/admin-auth'
import { getDbOrThrow } from '../../../../utils/db'
import {
  findAffiliateBySlug,
  recordAffiliateAdminAction,
  sendAffiliatePrivateLinkEmail,
} from '../../../../utils/affiliate-admin'
import { buildAffiliatePrivateDashboardUrl, generateAffiliateSecretToken } from '../../../../utils/affiliate'

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const slug = getRouterParam(event, 'slug') || ''
  const db = getDbOrThrow(event)
  const affiliate = await findAffiliateBySlug(slug)

  if (!affiliate) {
    throw createError({ statusCode: 404, statusMessage: 'Affilie introuvable.' })
  }

  const secretToken = generateAffiliateSecretToken()

  await db
    .update(affiliates)
    .set({ secretToken })
    .where(eq(affiliates.id, affiliate.id))

  const privateDashboardUrl = buildAffiliatePrivateDashboardUrl(affiliate.slug, secretToken)

  await recordAffiliateAdminAction({
    affiliateId: affiliate.id,
    action: 'token_regenerated',
    status: 'success',
    details: {
      privateDashboardUrl,
    },
  })

  const emailDelivery = await sendAffiliatePrivateLinkEmail({
    email: affiliate.email,
    name: affiliate.name,
    privateDashboardUrl,
  })

  await recordAffiliateAdminAction({
    affiliateId: affiliate.id,
    action: emailDelivery.sent ? 'invite_sent' : 'invite_failed',
    status: emailDelivery.sent ? 'success' : 'failed',
    details: {
      privateDashboardUrl,
      reason: emailDelivery.reason || null,
    },
  })

  return {
    ok: true,
    privateDashboardUrl,
    emailDelivery,
  }
})
