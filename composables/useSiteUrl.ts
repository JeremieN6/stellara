function isLocalHost(value: string): boolean {
  try {
    const url = new URL(value)
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1'
  } catch {
    return /localhost|127\.0\.0\.1|::1/.test(value)
  }
}

// Nuxt's own runtimeConfig default for public.siteUrl is itself
// 'http://localhost:3000' (see nuxt.config.ts), so an unset env var is
// never an empty string here. A naive `configuredUrl || fallback` check
// would therefore never fall through, even in prod. This mirrors the
// same defensive chain already used in server/routes/sitemap.xml.ts:
// configured value -> real request origin -> hardcoded prod fallback,
// rejecting any candidate that looks like localhost.
export function useSiteUrl() {
  const config = useRuntimeConfig()
  const requestUrl = useRequestURL()

  return computed(() => {
    const configuredUrl = String(config.public?.siteUrl || '').trim().replace(/\/+$/, '')
    const requestOrigin = requestUrl.origin.replace(/\/+$/, '')
    const fallbackUrl = 'https://stellara.sassify.fr'

    if (configuredUrl && !isLocalHost(configuredUrl)) {
      return configuredUrl
    }

    if (requestOrigin && !isLocalHost(requestOrigin)) {
      return requestOrigin
    }

    // Both the configured value and the request origin look like
    // localhost (e.g. testing directly against the Node process via
    // 127.0.0.1, bypassing any reverse proxy) -- returning either one
    // here would just hand back a localhost URL. Go straight to the
    // hardcoded prod fallback instead.
    return fallbackUrl
  })
}
