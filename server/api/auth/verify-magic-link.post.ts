import { createHash } from 'node:crypto'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { authMagicLinks } from '../../../db/schema'
import { getDbOrThrow } from '../../utils/db'
import { setAccountSessionCookie } from '../../utils/auth-session'

interface VerifyMagicLinkBody {
  token?: string
}

function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<VerifyMagicLinkBody>(event)
  const token = String(body.token || '').trim()

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'token is required' })
  }

  const db = getDbOrThrow(event)
  const now = new Date()
  const tokenHash = hashToken(token)

  const [row] = await db
    .select()
    .from(authMagicLinks)
    .where(and(
      eq(authMagicLinks.tokenHash, tokenHash),
      isNull(authMagicLinks.usedAt),
      gt(authMagicLinks.expiresAt, now),
    ))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 400, statusMessage: 'Magic link invalid or expired' })
  }

  await db
    .update(authMagicLinks)
    .set({ usedAt: now })
    .where(eq(authMagicLinks.id, row.id))

  setAccountSessionCookie(event, row.email)

  return {
    ok: true,
    email: row.email,
  }
})
