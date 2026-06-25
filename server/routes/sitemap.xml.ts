import blogData from '../../data/blog.json'

type BlogEntry = {
  slug?: string
  date?: string
}

const pageModules = import.meta.glob('../../pages/**/*.vue')

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

function normalizeRoute(route: string): string {
  if (!route || route === '/index') return '/'

  const withoutIndex = route.replace(/\/index$/, '/')
  const noTrailingSlash = withoutIndex.length > 1 ? withoutIndex.replace(/\/+$/, '') : withoutIndex

  return noTrailingSlash || '/'
}

function pageFileToRoute(filePath: string): string | null {
  const relative = filePath.replace('../../pages', '').replace(/\.vue$/, '')
  const route = normalizeRoute(relative || '/')

  if (!route.startsWith('/')) return null
  if (route.includes('[') || route.includes(']')) return null
  if (route === '/admin' || route.startsWith('/admin/')) return null
  if (route === '/api' || route.startsWith('/api/')) return null

  return route
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler((event) => {
  const baseUrl = normalizeBaseUrl(event)
  const nowIso = new Date().toISOString()

  const staticRoutes = Object.keys(pageModules)
    .map(pageFileToRoute)
    .filter((route): route is string => Boolean(route))

  const blogEntries = (Array.isArray(blogData) ? blogData : []) as BlogEntry[]
  const blogRoutes = blogEntries
    .map((entry) => entry.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.trim().length > 0)
    .map((slug) => `/blog/${slug}`)

  const routeLastMod = new Map<string, string>()
  for (const route of staticRoutes) {
    routeLastMod.set(route, nowIso)
  }
  for (const entry of blogEntries) {
    if (!entry.slug) continue
    const route = `/blog/${entry.slug}`
    const date = typeof entry.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
      ? entry.date
      : nowIso
    routeLastMod.set(route, date)
  }

  const uniqueRoutes = Array.from(new Set([...staticRoutes, ...blogRoutes]))
    .sort((a, b) => {
      if (a === '/') return -1
      if (b === '/') return 1
      return a.localeCompare(b)
    })

  const urlsXml = uniqueRoutes
    .map((route) => {
      const loc = escapeXml(`${baseUrl}${route}`)
      const lastmod = escapeXml(routeLastMod.get(route) || nowIso)
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlsXml,
    '</urlset>',
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
