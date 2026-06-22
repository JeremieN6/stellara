import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const SESSION_COOKIE_NAME = 'stellara_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function getAuthSecret(event?: H3Event): string {
  const config = useRuntimeConfig(event)
  const secret = String(config.authSessionSecret || '').trim()

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'AUTH_SESSION_SECRET/JWT_SECRET is not configured',
    })
  }

  return secret
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('base64url')
}

export function createAccountSessionToken(email: string, event?: H3Event): string {
  const secret = getAuthSecret(event)
  const normalizedEmail = email.trim().toLowerCase()
  const now = Math.floor(Date.now() / 1000)
  const payload = JSON.stringify({
    email: normalizedEmail,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  })

  const encodedPayload = toBase64Url(payload)
  const signature = signPayload(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export function readAccountSessionEmail(event: H3Event): string | null {
  const token = String(getCookie(event, SESSION_COOKIE_NAME) || '').trim()
  if (!token || !token.includes('.')) return null

  const [encodedPayload, signature] = token.split('.', 2)
  if (!encodedPayload || !signature) return null

  let secret = ''
  try {
    secret = getAuthSecret(event)
  } catch {
    return null
  }

  const expectedSignature = signPayload(encodedPayload, secret)
  try {
    const expectedBuffer = Buffer.from(expectedSignature, 'base64url')
    const signatureBuffer = Buffer.from(signature, 'base64url')
    if (expectedBuffer.length !== signatureBuffer.length) return null
    if (!timingSafeEqual(expectedBuffer, signatureBuffer)) return null
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as {
      email?: string
      exp?: number
    }

    if (!payload.email || !payload.exp) return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload.email.trim().toLowerCase()
  } catch {
    return null
  }
}

export function setAccountSessionCookie(event: H3Event, email: string) {
  const token = createAccountSessionToken(email, event)

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearAccountSessionCookie(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    path: '/',
  })
}
