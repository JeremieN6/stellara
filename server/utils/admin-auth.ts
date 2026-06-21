import type { H3Event } from 'h3'

export function assertAdminAccess(event: H3Event) {
  const config = useRuntimeConfig(event)
  const expectedToken = String(config.adminToken || '').trim()

  if (!expectedToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ADMIN_TOKEN is not configured.',
    })
  }

  const authHeader = getHeader(event, 'authorization') || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  const queryToken = String(getQuery(event).token || '').trim()
  const providedToken = bearerToken || queryToken

  if (!providedToken || providedToken !== expectedToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized admin access.' })
  }
}
