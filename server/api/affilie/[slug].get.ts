import { getAffiliatePublicDashboard } from '../../utils/affiliate'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const dashboard = await getAffiliatePublicDashboard(slug)

  if (!dashboard) {
    throw createError({ statusCode: 404, statusMessage: 'Affilie introuvable.' })
  }

  return dashboard
})
