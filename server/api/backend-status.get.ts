import { getDbIfConfigured } from '../utils/db'

export default defineEventHandler(async (event) => {
  const db = getDbIfConfigured(event)
  const config = useRuntimeConfig(event)

  return {
    backend: 'nuxt-nitro',
    mode: 'progressive-symfony-removal',
    databaseConfigured: Boolean(db),
    hasAstrologyApiKey: Boolean((config.astrologyApiKey || '').trim()),
    hasAnthropicApiKey: Boolean((config.anthropicApiKey || '').trim()),
    hasOpenAiApiKey: Boolean((config.openaiApiKey || '').trim()),
    timestamp: new Date().toISOString(),
  }
})
