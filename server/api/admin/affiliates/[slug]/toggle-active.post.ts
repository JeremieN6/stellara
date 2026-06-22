import { eq } from 'drizzle-orm'
import { affiliates } from '../../../../../db/schema'
import { assertAdminAccess } from '../../../../utils/admin-auth'
import { getDbOrThrow } from '../../../../utils/db'
import { recordAffiliateAdminAction, findAffiliateBySlug } from '../../../../utils/affiliate-admin'

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const slug = getRouterParam(event, 'slug') || ''
  const db = getDbOrThrow(event)
  const affiliate = await findAffiliateBySlug(slug)

  if (!affiliate) {
    throw createError({ statusCode: 404, statusMessage: 'Affilie introuvable.' })
  }

  const nextActive = !affiliate.active

  await db
    .update(affiliates)
    .set({ active: nextActive })
    .where(eq(affiliates.id, affiliate.id))

  await recordAffiliateAdminAction({
    affiliateId: affiliate.id,
    action: nextActive ? 'affiliate_enabled' : 'affiliate_disabled',
    status: 'success',
    details: {
      active: nextActive,
    },
  })

  return {
    ok: true,
    active: nextActive,
  }
})
