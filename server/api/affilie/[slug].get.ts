import { timingSafeEqual } from 'node:crypto'
import { getAffiliatePublicDashboard } from '../../utils/affiliate'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const token = String(getQuery(event).token || '').trim()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Token requis pour acceder a ce tableau de bord.' })
  }

  const dashboard = await getAffiliatePublicDashboard(slug)

  if (!dashboard) {
    throw createError({ statusCode: 404, statusMessage: 'Affilie introuvable.' })
  }

  let tokensMatch = false
  try {
    const a = Buffer.from(token, 'utf8')
    const b = Buffer.from(dashboard._secretToken, 'utf8')
    if (a.length === b.length) {
      tokensMatch = timingSafeEqual(a, b)
    }
  } catch {
    tokensMatch = false
  }

  if (!tokensMatch) {
    throw createError({ statusCode: 403, statusMessage: 'Acces refuse.' })
  }

  const { _secretToken: _, ...publicDashboard } = dashboard
  return publicDashboard
})
