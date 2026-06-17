import { buildNatalChart } from '../utils/astro'
import { reports } from '../../db/schema'
import { getDbIfConfigured } from '../utils/db'
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

  // Generate AI summary if OpenAI key is configured
  const config = useRuntimeConfig()
  const fallbackSummary = generateFallbackSummary(body.firstName, chart)
  let summary = fallbackSummary

  if (config.openaiApiKey) {
    try {
      summary = await generateAiSummary(body, chart, config.openaiApiKey as string, 4500)
    } catch (err) {
      console.error('[OpenAI] Error:', err)
      summary = fallbackSummary
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
      }).returning({ id: reports.id })

      reportId = inserted[0]?.id ?? null
    } catch (err) {
      // Do not fail the user flow when persistence is unavailable.
      console.error('[generate-report] DB insert failed:', err)
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
    fullAnalysis: null, // premium only
  }
})

async function generateAiSummary(
  user: ReportRequest,
  chart: ReturnType<typeof buildNatalChart>,
  apiKey: string,
  timeoutMs = 4500,
): Promise<string> {
  const planetsList = chart.planets.map((p) => `${p.planet} en ${p.sign}`).join(', ')

  const prompt = `Tu es un expert en astrologie. Rédige un portrait astrologique personnalisé et bienveillant en français pour ${user.firstName}.

Données du thème natal :
- Signe Solaire : ${chart.sunSign}
- Signe Lunaire : ${chart.moonSign}
- Ascendant : ${chart.ascendant} (${chart.ascendantDegree}°)
- Planètes : ${planetsList}

Rédige un paragraphe de 120-160 mots qui synthétise la personnalité, les forces et les défis principaux.
Style : direct, précis, encourageant. Évite les formules génériques. Commence par le prénom.`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 220,
        temperature: 0.8,
      }),
    })

    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`)
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return data.choices[0]?.message?.content?.trim() || ''
  } finally {
    clearTimeout(timeout)
  }
}

function generateFallbackSummary(firstName: string, chart: ReturnType<typeof buildNatalChart>): string {
  return `${firstName}, votre thème natal révèle une personnalité façonnée par une combinaison unique d'énergies cosmiques. En tant que ${chart.sunSign}, vous portez en vous une énergie solaire distinctive. Votre Lune en ${chart.moonSign} guide votre vie émotionnelle intérieure, vous donnant une sensibilité particulière et des réactions instinctives caractéristiques. Votre Ascendant en ${chart.ascendant} constitue votre façade au monde, la première impression que vous laissez et la manière dont vous abordez les nouvelles situations. L'ensemble de vos positions planétaires dessine un portrait complexe et nuancé qui va bien au-delà de votre simple signe solaire. Chaque planète dans son signe apporte une couleur unique à votre personnalité, vos désirs, votre communication et votre façon d'interagir avec le monde. Votre rapport complet explore ces nuances en profondeur.`
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
