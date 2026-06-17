import { runLeadSequenceBatch } from '../../../utils/lead-sequence'

function assertAdminAccess(event: Parameters<typeof defineEventHandler>[0]) {
  const config = useRuntimeConfig(event)
  const expectedToken = String(config.adminToken || '').trim()

  if (!expectedToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ADMIN_TOKEN is not configured.',
    })
  }

  const authHeader = getHeader(event, 'authorization') || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  const queryToken = String(getQuery(event).token || '').trim()
  const provided = bearer || queryToken

  if (!provided || provided !== expectedToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized admin access.',
    })
  }
}

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const body = await readBody<{ limit?: number }>(event).catch(() => ({}))
  const limit = Math.min(Math.max(Number(body?.limit || 50), 1), 300)

  const result = await runLeadSequenceBatch(limit)
  return {
    ok: true,
    ...result,
  }
})
