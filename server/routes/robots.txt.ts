function normalizeBaseUrl(event: Parameters<typeof useRuntimeConfig>[0]): string {
  const config = useRuntimeConfig(event)
  const raw = (
    config.public.appUrl
    || config.public.siteUrl
    || process.env.NEXT_PUBLIC_APP_URL
    || process.env.NUXT_PUBLIC_APP_URL
    || process.env.NUXT_PUBLIC_SITE_URL
    || 'http://localhost:3000'
  ).trim()

  return raw.replace(/\/+$/, '')
}

export default defineEventHandler((event) => {
  const baseUrl = normalizeBaseUrl(event)
  const host = baseUrl.replace(/^https?:\/\//, '')

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
