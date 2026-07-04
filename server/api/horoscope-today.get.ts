type HoroscopeSign =
  | 'belier'
  | 'taureau'
  | 'gemeaux'
  | 'cancer'
  | 'lion'
  | 'vierge'
  | 'balance'
  | 'scorpion'
  | 'sagittaire'
  | 'capricorne'
  | 'verseau'
  | 'poissons'

const VALID_SIGNS: HoroscopeSign[] = [
  'belier',
  'taureau',
  'gemeaux',
  'cancer',
  'lion',
  'vierge',
  'balance',
  'scorpion',
  'sagittaire',
  'capricorne',
  'verseau',
  'poissons',
]

const SIGN_LABELS: Record<HoroscopeSign, string> = {
  belier: 'Belier',
  taureau: 'Taureau',
  gemeaux: 'Gemeaux',
  cancer: 'Cancer',
  lion: 'Lion',
  vierge: 'Vierge',
  balance: 'Balance',
  scorpion: 'Scorpion',
  sagittaire: 'Sagittaire',
  capricorne: 'Capricorne',
  verseau: 'Verseau',
  poissons: 'Poissons',
}

interface HoroscopePayload {
  reading: string
  readingFr: string
  provider: 'api_ninjas'
}

interface LocalizedHoroscopePayload {
  readingFr: string
  localizationSource: 'anthropic' | 'openai'
}

function normalizeSign(value?: string): HoroscopeSign | null {
  const input = (value || '').trim().toLowerCase()
  if (!input) return null
  const direct = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (VALID_SIGNS.includes(direct as HoroscopeSign)) {
    return direct as HoroscopeSign
  }
  return null
}

function normalizeLang(value?: string): 'fr' {
  return value === 'fr' ? 'fr' : 'fr'
}

function getLocalDateISO(timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(new Date())
}

function extractReading(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  const candidates = [data.horoscope, data.description, data.prediction, data.text]
  for (const item of candidates) {
    if (typeof item === 'string' && item.trim()) {
      return item.trim().slice(0, 1400)
    }
  }
  return null
}

function truncateText(value: unknown, max = 700): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function parseJsonFromModel(rawText: string): Record<string, unknown> | null {
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
        return parsed as Record<string, unknown>
      }
    } catch {
      continue
    }
  }

  return null
}

function buildLocalizationPrompt(sign: HoroscopeSign, dateIso: string, reading: string): string {
  return [
    `Source horoscope reelle pour ${SIGN_LABELS[sign]} (${dateIso}):`,
    reading,
    '',
    'Tache:',
    '- Traduire en francais fidele.',
    "- Interdiction d'inventer des faits non presents dans la source.",
    '- Repondre en JSON strict uniquement:',
    '{"readingFr":"..."}',
  ].join('\n')
}

async function localizeWithAnthropic(
  sign: HoroscopeSign,
  dateIso: string,
  reading: string,
  apiKey: string,
): Promise<LocalizedHoroscopePayload> {
  const prompt = buildLocalizationPrompt(sign, dateIso, reading)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-latest',
      system: 'Tu renvoies uniquement un JSON valide, sans markdown.',
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
      max_tokens: 700,
      temperature: 0,
    }),
  })

  if (!res.ok) {
    throw new Error(`Anthropic HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>
  }

  const text = data.content
    ?.filter((item) => item.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text as string)
    .join('\n')
    .trim() || ''

  const parsed = parseJsonFromModel(text)
  if (!parsed) {
    throw new Error('Anthropic invalid JSON')
  }

  const readingFr = truncateText(parsed.readingFr, 1400)
  if (!readingFr) {
    throw new Error('Anthropic missing readingFr')
  }

  return {
    readingFr,
    localizationSource: 'anthropic',
  }
}

async function localizeWithOpenAI(
  sign: HoroscopeSign,
  dateIso: string,
  reading: string,
  apiKey: string,
): Promise<LocalizedHoroscopePayload> {
  const prompt = buildLocalizationPrompt(sign, dateIso, reading)

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu renvoies uniquement un JSON valide, sans markdown.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: 700,
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenAI HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content || ''
  const parsed = parseJsonFromModel(content)
  if (!parsed) {
    throw new Error('OpenAI invalid JSON')
  }

  const readingFr = truncateText(parsed.readingFr, 1400)
  if (!readingFr) {
    throw new Error('OpenAI missing readingFr')
  }

  return {
    readingFr,
    localizationSource: 'openai',
  }
}

async function localizeToFrench(
  sign: HoroscopeSign,
  dateIso: string,
  reading: string,
  anthropicApiKey: string,
  openaiApiKey: string,
): Promise<LocalizedHoroscopePayload> {
  if (anthropicApiKey) {
    return localizeWithAnthropic(sign, dateIso, reading, anthropicApiKey)
  }

  if (openaiApiKey) {
    return localizeWithOpenAI(sign, dateIso, reading, openaiApiKey)
  }

  throw createError({
    statusCode: 503,
    statusMessage: 'French localization is not configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.',
  })
}

const API_NINJAS_SIGN: Record<HoroscopeSign, string> = {
  belier: 'aries',
  taureau: 'taurus',
  gemeaux: 'gemini',
  cancer: 'cancer',
  lion: 'leo',
  vierge: 'virgo',
  balance: 'libra',
  scorpion: 'scorpio',
  sagittaire: 'sagittarius',
  capricorne: 'capricorn',
  verseau: 'aquarius',
  poissons: 'pisces',
}

async function fetchFromApiNinjas(sign: HoroscopeSign, apiKey: string, baseUrl: string): Promise<HoroscopePayload> {
  const endpoint = new URL('/v1/horoscope', baseUrl)
  endpoint.searchParams.set('zodiac', API_NINJAS_SIGN[sign])
  endpoint.searchParams.set('day', 'today')

  const res = await fetch(endpoint.toString(), {
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `Horoscope provider error (HTTP ${res.status}).`,
    })
  }

  const raw = (await res.json()) as unknown
  const reading = extractReading(raw)
  if (!reading) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Horoscope provider response is missing reading content.',
    })
  }

  return {
    reading,
    readingFr: '',
    provider: 'api_ninjas',
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sign = normalizeSign(typeof query.sign === 'string' ? query.sign : undefined)
  if (!sign) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing zodiac sign.',
    })
  }
  const lang = normalizeLang(typeof query.lang === 'string' ? query.lang : undefined)
  const timeZone = typeof query.timezone === 'string' && query.timezone.trim()
    ? query.timezone
    : 'Europe/Paris'

  const dateIso = getLocalDateISO(timeZone)
  const cacheKey = `horoscope:daily:v3:${dateIso}:${sign}:${lang}:api_ninjas`
  const storage = useStorage('cache')
  const cached = await storage.getItem<{ payload: HoroscopePayload }>(cacheKey)

  if (cached?.payload) {
    return {
      date: dateIso,
      sign,
      ...cached.payload,
      source: 'cache',
      disclaimer: 'Contenu a visée de divertissement.',
    }
  }

  const config = useRuntimeConfig(event)
  const apiKey = (config.astrologyApiKey || '').trim()
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Horoscope provider is not configured. Set ASTROLOGY_API_KEY or ASTRO_API_KEY.',
    })
  }

  const baseUrl = (config.astrologyApiBaseUrl || 'https://api.api-ninjas.com').trim()
  const sourcePayload = await fetchFromApiNinjas(sign, apiKey, baseUrl)
  const localized = await localizeToFrench(
    sign,
    dateIso,
    sourcePayload.reading,
    (config.anthropicApiKey || '').trim(),
    (config.openaiApiKey || '').trim(),
  )

  const payload: HoroscopePayload = {
    reading: sourcePayload.reading,
    readingFr: localized.readingFr,
    provider: sourcePayload.provider,
  }
  const source: 'api' = 'api'

  await storage.setItem(cacheKey, { payload }, { ttl: 60 * 60 * 24 })

  return {
    date: dateIso,
    sign,
    ...payload,
    source,
    disclaimer: 'Contenu a visée de divertissement.',
  }
})
