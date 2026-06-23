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
  mood: string
  love: string
  work: string
  energy: string
  advice: string
  intensity: number
}

function normalizeSign(value?: string): HoroscopeSign {
  const input = (value || '').trim().toLowerCase()
  const direct = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (VALID_SIGNS.includes(direct as HoroscopeSign)) return direct as HoroscopeSign
  return 'belier'
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

function clampIntensity(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return 60
  return Math.max(0, Math.min(100, Math.round(n)))
}

function truncate(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  return value.trim().slice(0, 220) || fallback
}

function sanitizePayload(raw: unknown, sign: HoroscopeSign): HoroscopePayload {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const label = SIGN_LABELS[sign]
  return {
    mood: truncate(data.mood, `Journee stable pour ${label}.`),
    love: truncate(data.love, 'Misez sur une communication simple et sincere.'),
    work: truncate(data.work, 'Priorisez une tache cle et avancez pas a pas.'),
    energy: truncate(data.energy, 'Rythme modere: alternez action et pause.'),
    advice: truncate(data.advice, 'Restez centre et avancez avec confiance.'),
    intensity: clampIntensity(data.intensity),
  }
}

function buildFallback(sign: HoroscopeSign): HoroscopePayload {
  return sanitizePayload({}, sign)
}

async function generateWithAI(sign: HoroscopeSign, dateIso: string, apiKey: string): Promise<HoroscopePayload> {
  const signLabel = SIGN_LABELS[sign]
  const prompt = [
    `Tu es un astrologue editorialisant des micro-horoscopes quotidiens en francais.`,
    `Genere le contenu pour le signe ${signLabel} pour la date ${dateIso}.`,
    `Contraintes: ton positif, concret, jamais anxiogene. Pas de sante, pas de finance, pas de promesse absolue.`,
    `Retourne UNIQUEMENT un JSON valide avec les cles suivantes: mood, love, work, energy, advice, intensity.`,
    `Chaque champ texte doit faire 1 a 2 phrases max. intensity est un entier de 0 a 100.`,
  ].join(' ')

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
          content: 'Tu reponds strictement en JSON compact sans markdown ni texte additionnel.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
      max_tokens: 280,
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenAI HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenAI empty content')

  const parsed = JSON.parse(content) as unknown
  return sanitizePayload(parsed, sign)
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sign = normalizeSign(typeof query.sign === 'string' ? query.sign : undefined)
  const lang = normalizeLang(typeof query.lang === 'string' ? query.lang : undefined)
  const timeZone = typeof query.timezone === 'string' && query.timezone.trim()
    ? query.timezone
    : 'Europe/Paris'

  const dateIso = getLocalDateISO(timeZone)
  const cacheKey = `horoscope:daily:${dateIso}:${sign}:${lang}`
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
  const hasAI = Boolean(config.openaiApiKey)
  let payload = buildFallback(sign)
  let source: 'ai' | 'fallback' = 'fallback'

  if (hasAI) {
    try {
      payload = await generateWithAI(sign, dateIso, config.openaiApiKey)
      source = 'ai'
    } catch (error) {
      console.error('[horoscope-today] AI generation failed:', error)
    }
  }

  await storage.setItem(cacheKey, { payload }, { ttl: 60 * 60 * 24 })

  return {
    date: dateIso,
    sign,
    ...payload,
    source,
    disclaimer: 'Contenu a visée de divertissement.',
  }
})
