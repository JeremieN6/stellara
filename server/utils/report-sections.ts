import type { NatalChart } from './astro'
import { buildHouseContext, computeAspects, HOUSE_THEMES, type AspectData } from './report-readings'

/**
 * Thematic report sections (Amour, Communication, Mission, Blocages, Aspects).
 * Each section exposes a free "teaser" (1-2 phrases) and a locked "full" body
 * that is only revealed to premium users. Static metadata (emoji/title) lives
 * here; only the generated {teaser, full} pair is persisted in the database.
 */

export interface StoredSection {
  teaser: string
  full: string
}

export interface ThematicSection extends StoredSection {
  key: string
  emoji: string
  title: string
}

export type StoredSections = Record<string, StoredSection>

interface SectionDef {
  key: string
  emoji: string
  title: string
}

export const SECTION_DEFS: SectionDef[] = [
  { key: 'amour', emoji: '💕', title: 'Amour & Relations' },
  { key: 'communication', emoji: '💬', title: 'Comment vous pensez et communiquez' },
  { key: 'mission', emoji: '🎯', title: 'Votre mission de vie et vos défis professionnels' },
  { key: 'blocages', emoji: '🔮', title: 'Les blocages qui vous freinent' },
  { key: 'aspects', emoji: '⭐', title: 'La carte des interactions entre vos planètes' },
]

interface Placement {
  sign: string | null
  house: number | null
}

interface SectionsContext {
  ascendant: string
  sun: Placement
  moon: Placement
  mercure: Placement
  venus: Placement
  mars: Placement
  jupiter: Placement
  saturne: Placement
  pluton: Placement
  midheavenSign: string | null
  aspects: AspectData[]
}

function buildContext(chart: NatalChart): SectionsContext {
  const houseContext = buildHouseContext(chart)
  const houseBySign = new Map<string, number>()
  for (const entry of houseContext) {
    houseBySign.set(entry.sign, Number(entry.house))
  }

  const signByPlanet = new Map<string, string>()
  signByPlanet.set('Soleil', chart.sunSign)
  signByPlanet.set('Lune', chart.moonSign)
  for (const planet of chart.planets) {
    signByPlanet.set(planet.planet, planet.sign)
  }

  const placement = (name: string): Placement => {
    const sign = signByPlanet.get(name) ?? null
    return { sign, house: sign ? houseBySign.get(sign) ?? null : null }
  }

  const midheaven = houseContext.find((entry) => Number(entry.house) === 10)

  return {
    ascendant: chart.ascendant,
    sun: placement('Soleil'),
    moon: placement('Lune'),
    mercure: placement('Mercure'),
    venus: placement('Vénus'),
    mars: placement('Mars'),
    jupiter: placement('Jupiter'),
    saturne: placement('Saturne'),
    pluton: placement('Pluton'),
    midheavenSign: midheaven?.sign ?? null,
    aspects: computeAspects(chart),
  }
}

function aspectsInvolving(aspects: AspectData[], bodies: string[]): AspectData[] {
  return aspects.filter((aspect) => bodies.includes(aspect.a) || bodies.includes(aspect.b))
}

function hardAspects(aspects: AspectData[]): AspectData[] {
  return aspects.filter((aspect) => aspect.type === 'carre' || aspect.type === 'opposition')
}

/** Per-section structured payload sent to the model (never free text). */
export function buildSectionsPromptData(chart: NatalChart, firstName: string) {
  const ctx = buildContext(chart)

  return {
    firstName,
    ascendant: ctx.ascendant,
    sections: {
      amour: {
        venus: ctx.venus,
        mars: ctx.mars,
        lune: ctx.moon,
        aspects: aspectsInvolving(ctx.aspects, ['Vénus', 'Mars', 'Lune']),
      },
      communication: {
        mercure: ctx.mercure,
        soleil: ctx.sun,
        aspects: aspectsInvolving(ctx.aspects, ['Mercure']),
      },
      mission: {
        jupiter: ctx.jupiter,
        saturne: ctx.saturne,
        milieuDuCiel: ctx.midheavenSign,
        maison10Theme: HOUSE_THEMES['10'],
        aspects: aspectsInvolving(ctx.aspects, ['Jupiter', 'Saturne']),
      },
      blocages: {
        saturne: ctx.saturne,
        pluton: ctx.pluton,
        aspectsDifficiles: hardAspects(ctx.aspects),
      },
      aspects: {
        tous: ctx.aspects,
      },
    },
  }
}

export const SECTIONS_SYSTEM_PROMPT = `Tu es un astrologue professionnel qui redige des lectures de theme natal en francais.

Objectif: produire 5 sections thematiques a fort impact, chacune avec un extrait gratuit accrocheur (teaser) et un contenu complet reserve (full).

Regles strictes:
- Utilise uniquement les donnees du JSON. N'invente jamais une position, une maison ou un aspect.
- Vouvoiement. Ton chaleureux, precis, psychologiquement fin. Jamais generique.
- Croise explicitement les placements entre eux (planete + signe + maison + aspects).
- teaser: 1 a 2 phrases qui donnent envie de debloquer, en terminant par une accroche ouverte (ex: "... mais votre theme revele pourquoi ...").
- full: 2 a 3 paragraphes concrets et personnalises.
- Section "aspects": synthetise les tensions et harmonies majeures en une narration coherente.
- Reponse obligatoire: JSON pur, sans markdown ni texte hors JSON.

Format EXACT attendu:
{
  "amour": { "teaser": "...", "full": "..." },
  "communication": { "teaser": "...", "full": "..." },
  "mission": { "teaser": "...", "full": "..." },
  "blocages": { "teaser": "...", "full": "..." },
  "aspects": { "teaser": "...", "full": "..." }
}`

export function buildSectionsUserPrompt(promptData: unknown): string {
  return `Donnees astrologiques calculees (ne rien supposer au-dela):\n${JSON.stringify(promptData, null, 2)}`
}

function placementLabel(placement: Placement): string {
  if (!placement.sign) return 'position indisponible'
  return placement.house
    ? `${placement.sign} (maison ${placement.house})`
    : placement.sign
}

/** Deterministic fallback used when the model is unavailable. */
export function generateFallbackSections(chart: NatalChart): StoredSections {
  const ctx = buildContext(chart)

  return {
    amour: {
      teaser: `Avec Vénus en ${placementLabel(ctx.venus)}, votre maniere d'aimer a une signature bien a vous, mais votre theme revele ce qui se joue en profondeur dans vos relations.`,
      full: `Vénus en ${placementLabel(ctx.venus)} colore votre facon d'aimer et de recevoir l'affection. Mars en ${placementLabel(ctx.mars)} indique votre elan et votre maniere d'aller vers l'autre, tandis que la Lune en ${placementLabel(ctx.moon)} eclaire vos besoins affectifs profonds. En reliant ces trois placements, vous comprenez mieux vos attentes et vos schemas relationnels.`,
    },
    communication: {
      teaser: `Mercure en ${placementLabel(ctx.mercure)} faconne votre facon de penser, mais votre theme montre pourquoi vous vous exprimez de cette maniere precise.`,
      full: `Mercure en ${placementLabel(ctx.mercure)} decrit votre style mental: comment vous apprenez, analysez et transmettez vos idees. En dialogue avec votre Soleil en ${placementLabel(ctx.sun)}, cela dessine une voix qui vous est propre, avec ses forces et ses points de vigilance dans les echanges.`,
    },
    mission: {
      teaser: `Jupiter en ${placementLabel(ctx.jupiter)} ouvre vos zones d'expansion, mais votre theme revele le defi structurant a depasser pour reussir.`,
      full: `Jupiter en ${placementLabel(ctx.jupiter)} indique ou vous grandissez avec le plus de fluidite. Saturne en ${placementLabel(ctx.saturne)} pointe l'effort et la maturite necessaires pour construire durablement.${ctx.midheavenSign ? ` Votre milieu du ciel en ${ctx.midheavenSign} oriente votre vocation.` : ''} Ensemble, ils tracent votre trajectoire professionnelle et vos leviers de reussite.`,
    },
    blocages: {
      teaser: `Saturne en ${placementLabel(ctx.saturne)} concentre vos freins interieurs, mais votre theme montre comment les transformer en force.`,
      full: `Saturne en ${placementLabel(ctx.saturne)} represente vos limitations structurantes et vos peurs a apprivoiser. Pluton en ${placementLabel(ctx.pluton)} pointe des schemas profonds et inconscients qui se rejouent. Les aspects de tension de votre carte revelent ou l'energie se bloque et comment la liberer progressivement.`,
    },
    aspects: {
      teaser: `Vos planetes ne travaillent pas isolement: leurs angles tissent une carte de tensions et d'harmonies unique, que votre rapport complet decode.`,
      full: ctx.aspects.length
        ? `Votre carte compte ${ctx.aspects.length} aspects majeurs. ${ctx.aspects
            .slice(0, 6)
            .map((aspect) => `${aspect.a} ${aspect.type} ${aspect.b}`)
            .join(', ')}. Chaque angle harmonieux est un talent naturel, chaque tension un chantier de croissance.`
        : `Votre carte presente peu d'aspects serres entre planetes, ce qui traduit une energie plus independante entre les differentes facettes de votre personnalite.`,
    },
  }
}

/** Merge model output with fallback, ensuring every section is present. */
export function normalizeStoredSections(
  raw: unknown,
  fallback: StoredSections,
): StoredSections {
  const normalized: StoredSections = {}
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

  for (const def of SECTION_DEFS) {
    const value = source[def.key]
    const fallbackSection = fallback[def.key]
    const teaser =
      value && typeof value === 'object' && typeof (value as StoredSection).teaser === 'string' && (value as StoredSection).teaser.trim()
        ? (value as StoredSection).teaser.trim()
        : fallbackSection.teaser
    const full =
      value && typeof value === 'object' && typeof (value as StoredSection).full === 'string' && (value as StoredSection).full.trim()
        ? (value as StoredSection).full.trim()
        : fallbackSection.full

    normalized[def.key] = { teaser, full }
  }

  return normalized
}

/** Reconstruct display-ready sections (static metadata + stored/fallback text). */
export function buildThematicSections(chart: NatalChart, stored: unknown): ThematicSection[] {
  const fallback = generateFallbackSections(chart)
  const merged = normalizeStoredSections(stored, fallback)

  return SECTION_DEFS.map((def) => ({
    key: def.key,
    emoji: def.emoji,
    title: def.title,
    teaser: merged[def.key].teaser,
    full: merged[def.key].full,
  }))
}
