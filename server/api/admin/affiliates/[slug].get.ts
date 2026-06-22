import { assertAdminAccess } from '../../../utils/admin-auth'
import { getAffiliateAdminDetail } from '../../../utils/affiliate-admin'

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const slug = getRouterParam(event, 'slug') || ''
  const detail = await getAffiliateAdminDetail(slug)

  if (!detail) {
    throw createError({ statusCode: 404, statusMessage: 'Affilie introuvable.' })
  }

  return detail
})
