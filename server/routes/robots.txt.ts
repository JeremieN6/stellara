function normalizeBaseUrl(event: Parameters<typeof useRuntimeConfig>[0]): string {
  const config = useRuntimeConfig(event)
  const rawConfigured = (
    config.public.appUrl
    || config.public.siteUrl
    || process.env.NEXT_PUBLIC_APP_URL
    || process.env.NUXT_PUBLIC_APP_URL
    || process.env.NUXT_PUBLIC_SITE_URL
  ).trim()

  const configuredUrl = rawConfigured.replace(/\/+$/, '')
  const requestOrigin = getRequestURL(event).origin.replace(/\/+$/, '')

  const isLocalHost = (value: string): boolean => {
    try {
      const url = new URL(value)
      return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1'
    } catch {
      return /localhost|127\.0\.0\.1|::1/.test(value)
    }
  }

  if (configuredUrl && !isLocalHost(configuredUrl)) {
    return configuredUrl
  }

  if (requestOrigin && !isLocalHost(requestOrigin)) {
    return requestOrigin
  }

  if (configuredUrl) {
    return configuredUrl
  }

  return 'https://stellara.sassify.fr'
}

export default defineEventHandler((event) => {
  const baseUrl = normalizeBaseUrl(event)
  const host = new URL(baseUrl).host

  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    `Host: ${host}`,
  ].join('\n')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return content
})
