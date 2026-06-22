import { createHash, randomBytes } from 'node:crypto'
import { and, eq, isNull, gt } from 'drizzle-orm'
import { authMagicLinks } from '../../../db/schema'
import { getDbOrThrow } from '../../utils/db'
import { sendPreviewEmail } from '../../utils/mailer'

interface MagicLinkRequestBody {
  email?: string
}

function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MagicLinkRequestBody>(event)
  const email = String(body.email || '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email is required' })
  }

  const db = getDbOrThrow(event)
  const now = new Date()

  const [existing] = await db
    .select({ id: authMagicLinks.id })
    .from(authMagicLinks)
    .where(and(
      eq(authMagicLinks.email, email),
      isNull(authMagicLinks.usedAt),
      gt(authMagicLinks.expiresAt, now),
    ))
    .limit(1)

  if (existing) {
    await db
      .update(authMagicLinks)
      .set({ usedAt: now })
      .where(eq(authMagicLinks.id, existing.id))
  }

  const rawToken = randomBytes(32).toString('base64url')
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000)

  await db.insert(authMagicLinks).values({
    email,
    tokenHash,
    expiresAt,
  })

  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.appUrl || config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  const loginUrl = `${siteUrl}/account?magic_token=${encodeURIComponent(rawToken)}`

  const sendResult = await sendPreviewEmail({
    to: email,
    subject: 'Votre lien de connexion Stellara',
    text: `Cliquez sur ce lien pour vous connecter: ${loginUrl}\nCe lien expire dans 20 minutes.`,
    html: `<p>Bonjour,</p><p>Cliquez sur ce lien pour vous connecter a votre espace Stellara:</p><p><a href=\"${loginUrl}\">Se connecter a mon compte</a></p><p>Ce lien expire dans 20 minutes.</p>`,
  })

  return {
    ok: true,
    email,
    sent: sendResult.sent,
    reason: sendResult.reason || null,
  }
})
