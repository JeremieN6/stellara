import { buildNatalChart } from '../utils/astro'
import { reports } from '../../db/schema'
import { getDbIfConfigured } from '../utils/db'
import {
  buildHouseContext,
  detectMajorAspects,
  generateFallbackHouseReadings,
  generateFallbackSummary,
  HOUSE_THEMES,
  normalizeHouseReadings,
} from '../utils/report-readings'
import tzLookup from 'tz-lookup'

interface ReportRequest {
  firstName: string
  birthDate: string   // YYYY-MM-DD
  birthTime: string   // HH:mm
  lat: number
  lon: number
  city: string
  gender: string
  email?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportRequest>(event)

  // Validate input
  if (!body.birthDate || !Number.isFinite(body.lat) || !Number.isFinite(body.lon)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Parse date + time
  const [year, month, day] = body.birthDate.split('-').map(Number)
  const [hours, minutes] = (body.birthTime || '12:00').split(':').map(Number)
  const timezone = tzLookup(body.lat, body.lon)
  const utcBirth = localDateTimeToUtc(year, month, day, hours, minutes, timezone)
  const utcHourDecimal =
    utcBirth.getUTCHours() +
    utcBirth.getUTCMinutes() / 60 +
    utcBirth.getUTCSeconds() / 3600

  // Calculate chart
  const chart = buildNatalChart(
    utcBirth.getUTCFullYear(),
    utcBirth.getUTCMonth() + 1,
    utcBirth.getUTCDate(),
    utcHourDecimal,
    body.lat,
    body.lon,
  )

  // Generate summary + 12 house readings once, then persist in DB.
  const config = useRuntimeConfig()
  const fallbackSummary = generateFallbackSummary(body.firstName, chart)
  const fallbackHouseReadings = generateFallbackHouseReadings(chart)
  let summary = fallbackSummary
  let houseReadings = fallbackHouseReadings

  if (config.anthropicApiKey) {
    try {
      const generated = await generateClaudeReadings(body, chart, config.anthropicApiKey as string, 7000)
      summary = generated.summary
      houseReadings = generated.houses
    } catch (err) {
      console.error('[Claude] Error:', err)
      summary = fallbackSummary
      houseReadings = fallbackHouseReadings
    }
  }

  let reportId: string | null = null
  const db = getDbIfConfigured(event)

  if (db) {
    try {
      const inserted = await db.insert(reports).values({
        firstName: body.firstName,
        birthDate: body.birthDate,
        birthTime: body.birthTime || null,
        city: body.city,
        lat: body.lat,
        lon: body.lon,
        gender: body.gender || null,
        email: body.email || null,
        sunSign: chart.sunSign,
        moonSign: chart.moonSign,
        ascendant: chart.ascendant,
        summary,
        houseReadings,
      }).returning({ id: reports.id })

      reportId = inserted[0]?.id ?? null
    } catch (err) {
      // Do not fail the user flow when persistence is unavailable.
      const message = err instanceof Error ? err.message : String(err)
      console.error('[generate-report] DB insert failed:', message)
    }
  }

  return {
    reportId,
    firstName: body.firstName,
    birthDate: body.birthDate,
    city: body.city,
    sunSign: chart.sunSign,
    moonSign: chart.moonSign,
    ascendant: chart.ascendant,
    ascendantDegree: chart.ascendantDegree,
    planets: chart.planets,
    summary,
    houseReadings,
    fullAnalysis: null, // premium only
  }
})

async function generateClaudeReadings(
  user: ReportRequest,
  chart: ReturnType<typeof buildNatalChart>,
  apiKey: string,
  timeoutMs = 7000,
): Promise<{ summary: string; houses: Record<string, string> }> {
  const houseContext = buildHouseContext(chart)
  const aspects = detectMajorAspects(chart)
  const fallback = {
    summary: generateFallbackSummary(user.firstName, chart),
    houses: generateFallbackHouseReadings(chart),
  }

  const signByPlanet = Object.fromEntries(chart.planets.map((planet) => [planet.planet, planet.sign]))
  const houseBySign = Object.fromEntries(houseContext.map((entry) => [entry.sign, Number(entry.house)]))

  const promptData = {
    firstName: user.firstName,
    ascendant: chart.ascendant,
    sun: {
      sign: chart.sunSign,
      house: houseBySign[chart.sunSign] ?? null,
    },
    moon: {
      sign: chart.moonSign,
      house: houseBySign[chart.moonSign] ?? null,
    },
    planets: {
      mercure: {
        sign: signByPlanet['Mercure'] ?? null,
        house: signByPlanet['Mercure'] ? (houseBySign[signByPlanet['Mercure']] ?? null) : null,
      },
      venus: {
        sign: signByPlanet['Vénus'] ?? null,
        house: signByPlanet['Vénus'] ? (houseBySign[signByPlanet['Vénus']] ?? null) : null,
      },
      mars: {
        sign: signByPlanet['Mars'] ?? null,
        house: signByPlanet['Mars'] ? (houseBySign[signByPlanet['Mars']] ?? null) : null,
      },
      jupiter: {
        sign: signByPlanet['Jupiter'] ?? null,
        house: signByPlanet['Jupiter'] ? (houseBySign[signByPlanet['Jupiter']] ?? null) : null,
      },
      saturne: {
        sign: signByPlanet['Saturne'] ?? null,
        house: signByPlanet['Saturne'] ? (houseBySign[signByPlanet['Saturne']] ?? null) : null,
      },
    },
    majorAspects: aspects,
    houses: houseContext.map((entry) => ({
      house: Number(entry.house),
      theme: HOUSE_THEMES[entry.house],
      sign: entry.sign,
      planetsInHouse: entry.planets,
    })),
  }

  const systemPrompt = `Tu es un astrologue professionnel qui redige des lectures de theme natal precises et engageantes en francais.

Regles strictes:
- Utilise uniquement les donnees du JSON utilisateur. N'invente jamais de position, d'aspect ou de maison.
- Ne sois pas generique. Croise explicitement les placements entre eux.
- Evite les formulations vagues type energie unique, combinaison cosmique, voyage interieur.
- Resume: 150-200 mots, vouvoiement, commence par le prenom, termine par une phrase qui invite a approfondir les maisons/aspects sans injonction commerciale.
- Maisons: 12 textes, chacun 60-80 mots, concrets et personnalises.
- Reponse obligatoire: JSON pur, sans markdown ni texte hors JSON.

Format EXACT attendu:
{
  "summary": "...",
  "houses": {
    "1": "...",
    "2": "...",
    "3": "...",
    "4": "...",
    "5": "...",
    "6": "...",
    "7": "...",
    "8": "...",
    "9": "...",
    "10": "...",
    "11": "...",
    "12": "..."
  }
}`

  const userPrompt = `Donnees astrologiques calculees (ne rien supposer au-dela):\n${JSON.stringify(promptData, null, 2)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        system: systemPrompt,
        messages: [{ role: 'user', content: [{ type: 'text', text: userPrompt }] }],
        max_tokens: 2200,
        temperature: 0.3,
      }),
    })

    if (!res.ok) throw new Error(`Claude HTTP ${res.status}`)
    const data = await res.json() as {
      content?: Array<{ type: string; text?: string }>
    }

    const rawText = data.content
      ?.filter((item) => item.type === 'text')
      .map((item) => item.text || '')
      .join('\n')
      .trim() || ''

    const parsed = parseJsonFromModel(rawText)
    if (!parsed) return fallback

    const summary = typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim()
      : fallback.summary
    const houses = normalizeHouseReadings(parsed.houses, fallback.houses)

    return { summary, houses }
  } finally {
    clearTimeout(timeout)
  }
}

function parseJsonFromModel(rawText: string): { summary?: unknown; houses?: unknown } | null {
  if (!rawText.trim()) return null

  const candidates = [rawText]
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fencedMatch?.[1]) {
    candidates.push(fencedMatch[1])
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      if (parsed && typeof parsed === 'object') {
        return parsed as { summary?: unknown; houses?: unknown }
      }
    } catch {
      // Continue trying alternative extraction.
    }
  }

  return null
}

function localDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const localAsUtcMillis = Date.UTC(year, month - 1, day, hour, minute, 0)
  let utcMillis = localAsUtcMillis

  // Iterate offset resolution to handle DST boundaries robustly.
  for (let i = 0; i < 2; i++) {
    const offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcMillis), timeZone)
    utcMillis = localAsUtcMillis - offsetMinutes * 60_000
  }

  return new Date(utcMillis)
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value])) as Record<string, string>

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )

  return (asUtc - date.getTime()) / 60_000
}
