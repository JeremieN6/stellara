import { assertAdminAccess } from '../../../../utils/admin-auth'
import {
  findAffiliateBySlug,
  recordAffiliateAdminAction,
  sendAffiliatePrivateLinkEmail,
} from '../../../../utils/affiliate-admin'
import { buildAffiliatePrivateDashboardUrl } from '../../../../utils/affiliate'

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const slug = getRouterParam(event, 'slug') || ''
  const affiliate = await findAffiliateBySlug(slug)

  if (!affiliate) {
    throw createError({ statusCode: 404, statusMessage: 'Affilie introuvable.' })
  }

  const privateDashboardUrl = buildAffiliatePrivateDashboardUrl(affiliate.slug, affiliate.secretToken)

  const emailDelivery = await sendAffiliatePrivateLinkEmail({
    email: affiliate.email,
    name: affiliate.name,
    privateDashboardUrl,
  })

  await recordAffiliateAdminAction({
    affiliateId: affiliate.id,
    action: emailDelivery.sent ? 'invite_resent' : 'invite_failed',
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
