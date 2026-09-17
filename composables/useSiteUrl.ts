export function useSiteUrl() {
  const config = useRuntimeConfig()

  return computed(() => {
    const configuredUrl = String(config.public?.siteUrl || '').trim()
    const fallbackUrl = 'https://stellara.sassify.fr'
    const baseUrl = configuredUrl || fallbackUrl
    return baseUrl.replace(/\/+$/, '')
  })
}
