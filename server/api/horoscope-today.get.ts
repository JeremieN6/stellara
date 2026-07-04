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
  provider: 'api_ninjas'
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
  const cacheKey = `horoscope:daily:v2:${dateIso}:${sign}:${lang}:api_ninjas`
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
      statusMessage: 'Horoscope provider is not configured. Set ASTROLOGY_API_KEY.',
    })
  }

  const baseUrl = (config.astrologyApiBaseUrl || 'https://api.api-ninjas.com').trim()
  const payload = await fetchFromApiNinjas(sign, apiKey, baseUrl)
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
