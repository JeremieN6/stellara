import { getDbIfConfigured } from '../utils/db'

export default defineEventHandler(async (event) => {
  const db = getDbIfConfigured(event)
  const config = useRuntimeConfig(event)

  const astrologyApiKey = (config.astrologyApiKey || process.env.ASTROLOGY_API_KEY || process.env.ASTRO_API_KEY || '').trim()
  const anthropicApiKey = (config.anthropicApiKey || process.env.ANTHROPIC_API_KEY || process.env.NUXT_ANTHROPIC_API_KEY || '').trim()
  const openAiApiKey = (config.openaiApiKey || process.env.OPENAI_API_KEY || process.env.NUXT_OPENAI_API_KEY || '').trim()

  return {
    backend: 'nuxt-nitro',
    mode: 'progressive-symfony-removal',
    databaseConfigured: Boolean(db),
    hasAstrologyApiKey: Boolean(astrologyApiKey),
    hasAnthropicApiKey: Boolean(anthropicApiKey),
    hasOpenAiApiKey: Boolean(openAiApiKey),
    timestamp: new Date().toISOString(),
  }
})
