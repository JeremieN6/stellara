import type { NatalChart, PlanetPosition } from './astro'

export const HOUSE_THEMES: Record<string, string> = {
  '1': 'Identite',
  '2': 'Valeurs et ressources',
  '3': 'Communication',
  '4': 'Foyer et racines',
  '5': 'Creativite et amour',
  '6': 'Sante et travail',
  '7': 'Partenariats',
  '8': 'Transformations',
  '9': 'Vision et philosophie',
  '10': 'Carriere et mission',
  '11': 'Amities et projets',
  '12': 'Inconscient',
}

const SIGN_ORDER = [
  'Bélier',
  'Taureau',
  'Gémeaux',
  'Cancer',
  'Lion',
  'Vierge',
  'Balance',
  'Scorpion',
  'Sagittaire',
  'Capricorne',
  'Verseau',
  'Poissons',
]

export interface HouseContextEntry {
  house: string
  theme: string
  sign: string
  planets: string[]
}

export function buildHouseContext(chart: NatalChart): HouseContextEntry[] {
  const ascIndex = SIGN_ORDER.indexOf(chart.ascendant)
  const safeAscIndex = ascIndex >= 0 ? ascIndex : 0

  const houseSigns = Array.from({ length: 12 }, (_, i) => SIGN_ORDER[(safeAscIndex + i) % 12])
  const signToHouse = new Map<string, string>()
  for (let i = 0; i < houseSigns.length; i++) {
    signToHouse.set(houseSigns[i], String(i + 1))
  }

  const planetsByHouse = new Map<string, string[]>()
  const allPlanets: PlanetPosition[] = [
    { planet: 'Soleil', sign: chart.sunSign, degree: 15 },
    { planet: 'Lune', sign: chart.moonSign, degree: 15 },
    ...chart.planets,
  ]

  for (const planet of allPlanets) {
    const house = signToHouse.get(planet.sign)
    if (!house) continue
    const existing = planetsByHouse.get(house) || []
    existing.push(planet.planet)
    planetsByHouse.set(house, existing)
  }

  return Array.from({ length: 12 }, (_, i) => {
    const house = String(i + 1)
    return {
      house,
      theme: HOUSE_THEMES[house],
      sign: houseSigns[i],
      planets: planetsByHouse.get(house) || [],
    }
  })
}

export function detectMajorAspects(chart: NatalChart): string[] {
  const aspects: Array<{ angle: number; label: string; orb: number }> = [
    { angle: 0, label: 'conjonction', orb: 6 },
    { angle: 60, label: 'sextile', orb: 4 },
    { angle: 90, label: 'carre', orb: 6 },
    { angle: 120, label: 'trigone', orb: 6 },
    { angle: 180, label: 'opposition', orb: 6 },
  ]

  const planets = chart.planets
  const results: string[] = []

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = zodiacToAbsoluteDegrees(planets[i].sign, planets[i].degree)
      const b = zodiacToAbsoluteDegrees(planets[j].sign, planets[j].degree)
      if (a === null || b === null) continue

      const diffRaw = Math.abs(a - b)
      const diff = diffRaw > 180 ? 360 - diffRaw : diffRaw

      const matched = aspects.find((aspect) => Math.abs(diff - aspect.angle) <= aspect.orb)
      if (!matched) continue

      results.push(`${planets[i].planet} ${matched.label} ${planets[j].planet}`)
      if (results.length >= 8) {
        return results
      }
    }
  }

  return results
}

export function generateFallbackSummary(firstName: string, chart: NatalChart): string {
  return `${firstName}, votre theme natal montre un axe clair entre votre Soleil en ${chart.sunSign}, votre Lune en ${chart.moonSign} et votre ascendant en ${chart.ascendant}. Cette combinaison suggere une facon bien particuliere de concilier votre identite, vos besoins emotionnels et votre maniere d agir dans le quotidien. Vos placements planetaires confirment des dynamiques complementaires: certaines poussent a l expression directe, d autres demandent plus de recul avant de trancher. Vous gagnez en puissance quand vous reliez votre intuition a des decisions concretes et progressives. Votre carte met aussi en lumiere des zones de tension utiles, qui peuvent devenir des leviers de maturite si elles sont travaillees consciemment. Cette lecture rapide pose la structure; le detail des maisons et des aspects permet d aller plus loin sur vos enjeux de vie.`
}

export function generateFallbackHouseReadings(chart: NatalChart): Record<string, string> {
  const context = buildHouseContext(chart)
  const readings: Record<string, string> = {}

  for (const entry of context) {
    const planetsText = entry.planets.length
      ? `Planetes a integrer: ${entry.planets.join(', ')}.`
      : 'Aucune planete majeure n y est placee dans les donnees disponibles.'

    readings[entry.house] = `Maison ${entry.house} (${entry.theme}) en ${entry.sign}. Cette configuration indique comment vous abordez ce domaine de vie avec des reflexes propres a ce signe. ${planetsText} Le potentiel se developpe surtout lorsque vous appliquez ces tendances de facon concrete et reguliere.`
  }

  return readings
}

export function normalizeHouseReadings(
  raw: unknown,
  fallback: Record<string, string>,
): Record<string, string> {
  const normalized: Record<string, string> = { ...fallback }
  if (!raw || typeof raw !== 'object') return normalized

  const source = raw as Record<string, unknown>
  for (let i = 1; i <= 12; i++) {
    const key = String(i)
    const value = source[key]
    if (typeof value === 'string' && value.trim()) {
      normalized[key] = value.trim()
    }
  }

  return normalized
}

function zodiacToAbsoluteDegrees(sign: string, degree: number): number | null {
  const signIndex = SIGN_ORDER.indexOf(sign)
  if (signIndex < 0) return null
  return signIndex * 30 + degree
}
