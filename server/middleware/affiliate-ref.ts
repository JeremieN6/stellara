import { AFFILIATE_COOKIE_NAME, trackAffiliateClick } from '../utils/affiliate'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') return

  const query = getQuery(event)
  const ref = typeof query.ref === 'string' ? query.ref : ''
  if (!ref) return

  try {
    const affiliate = await trackAffiliateClick(ref, getHeader(event, 'referer') || null)
    if (!affiliate) return

    setCookie(event, AFFILIATE_COOKIE_NAME, affiliate.slug, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
      path: '/',
    })
  } catch (error) {
    console.error('[affiliate-ref] tracking failed:', error)
  }
})
