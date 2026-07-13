import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { getDbIfConfigured } from '../utils/db'

async function readDeployVersion() {
  try {
    const raw = await readFile(resolve(process.cwd(), '.deploy-version.json'), 'utf8')
    const parsed = JSON.parse(raw) as {
      commit?: string
      shortCommit?: string
      subject?: string
      deployedAt?: string
    }

    return {
      commit: String(parsed.commit || '').trim(),
      shortCommit: String(parsed.shortCommit || '').trim(),
      subject: String(parsed.subject || '').trim(),
      deployedAt: String(parsed.deployedAt || '').trim(),
    }
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const db = getDbIfConfigured(event)
  const config = useRuntimeConfig(event)
  const deployedVersion = await readDeployVersion()

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
    deployedVersion,
    timestamp: new Date().toISOString(),
  }
})
