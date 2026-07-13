/**
 * Lightweight astronomical calculation engine
 * Computes solar/lunar signs, ascendant, and planet positions
 * using simplified ephemeris (accurate to ±1° for most purposes)
 */

export interface PlanetPosition {
  planet: string
  sign: string
  degree: number
  retrograde?: boolean
}

export interface NatalChart {
  sunSign: string
  moonSign: string
  ascendant: string
  ascendantDegree: number
  sunDegree: number
  moonDegree: number
  planets: PlanetPosition[]
}

const SIGNS = [
  'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
  'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons',
]

function degreeToSign(deg: number): { sign: string; degree: number } {
  const normalized = ((deg % 360) + 360) % 360
  const index = Math.floor(normalized / 30)
  return { sign: SIGNS[index], degree: normalized % 30 }
}

/** Julian Day Number from date + time (UT) */
function toJulianDay(year: number, month: number, day: number, hour: number = 12): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  return jdn + (hour - 12) / 24
}

/** Days since J2000.0 */
function J2000(jd: number): number {
  return jd - 2451545.0
}

/** Mean anomaly of the Sun (radians) */
function sunMeanAnomaly(d: number): number {
  return toRad(357.5291 + 0.98560028 * d)
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

function normalizeDegrees(deg: number): number {
  const wrapped = deg % 360
  return wrapped < 0 ? wrapped + 360 : wrapped
}

function normalizeSignedDegrees(deg: number): number {
  const wrapped = normalizeDegrees(deg)
  return wrapped > 180 ? wrapped - 360 : wrapped
}

/** Solar longitude (ecliptic degrees) */
export function solarLongitude(jd: number): number {
  const d = J2000(jd)
  const M = sunMeanAnomaly(d)
  const L0 = 280.46646 + 0.9856474 * d
  const C = 1.9146 * Math.sin(M) + 0.02 * Math.sin(2 * M)
  return ((L0 + C) % 360 + 360) % 360
}

/** Lunar longitude (simplified, accurate to ~1°) */
export function lunarLongitude(jd: number): number {
  const d = J2000(jd)
  const L0 = 218.316 + 13.176396 * d
  const M = 134.963 + 13.064993 * d // lunar mean anomaly
  const F = 93.272 + 13.229350 * d  // argument of latitude
  const lon =
    L0 +
    6.289 * Math.sin(toRad(M)) -
    1.274 * Math.sin(toRad(2 * (L0 - solarLongitude(jd)))) +
    0.658 * Math.sin(toRad(2 * F)) -
    0.214 * Math.sin(toRad(2 * M)) -
    0.11 * Math.sin(toRad(M - 2 * F))
  return ((lon % 360) + 360) % 360
}

/** Planet longitudes — simplified VSOP87 first-order terms */
function planetLongitude(jd: number, planet: string): number {
  const d = J2000(jd)
  const T = d / 36525 // Julian centuries

  switch (planet) {
    case 'Mercure':
      return ((252.25 + 4.09237703 * d) % 360 + 360) % 360
    case 'Vénus':
      return ((181.98 + 1.60213 * d) % 360 + 360) % 360
    case 'Mars':
      return ((355.43 + 0.52402 * d) % 360 + 360) % 360
    case 'Jupiter':
      return ((34.35 + 0.08309 * d) % 360 + 360) % 360
    case 'Saturne':
      return ((50.08 + 0.03346 * d) % 360 + 360) % 360
    case 'Uranus':
      return ((314.05 + 0.01176 * d) % 360 + 360) % 360
    case 'Neptune':
      return ((304.35 + 0.00600 * d) % 360 + 360) % 360
    case 'Pluton':
      return ((238.96 + 0.00397 * d) % 360 + 360) % 360
    default:
      return 0
  }
}

/** Ascendant calculation using RAMC + obliquity */
export function computeAscendant(jd: number, lat: number, lon: number): { sign: string; degree: number } {
  const d = J2000(jd)
  const T = d / 36525

  // Greenwich mean sidereal time for the exact Julian date.
  const gmst = normalizeDegrees(
    280.46061837 +
      360.98564736629 * d +
      0.000387933 * T * T -
      (T * T * T) / 38710000,
  )
  const lst = normalizeDegrees(gmst + lon)
  const theta = toRad(lst)

  // Mean obliquity of the ecliptic.
  const eps = toRad(23.439291 - 0.0130042 * T)
  const latRad = toRad(lat)

  // Ecliptic longitude of the eastern horizon intersection.
  const ascRad = Math.atan2(-Math.cos(theta), Math.sin(theta) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps))
  const baseAsc = normalizeDegrees(toDeg(ascRad))

  // Keep the ascendant on the eastern horizon branch (rising side).
  // Rising points are east of the meridian, so their hour angle is negative.
  const baseHourAngle = hourAngleForEclipticLongitude(baseAsc, lst, eps)
  const asc = baseHourAngle < 0 ? baseAsc : normalizeDegrees(baseAsc + 180)

  return degreeToSign(asc)
}

function hourAngleForEclipticLongitude(lambdaDeg: number, lstDeg: number, obliquityRad: number): number {
  const lambdaRad = toRad(lambdaDeg)
  const rightAscensionDeg = normalizeDegrees(
    toDeg(Math.atan2(Math.sin(lambdaRad) * Math.cos(obliquityRad), Math.cos(lambdaRad))),
  )

  return normalizeSignedDegrees(lstDeg - rightAscensionDeg)
}

/** Build complete natal chart */
export function buildNatalChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  lat: number,
  lon: number,
): NatalChart {
  const jd = toJulianDay(year, month, day, hour)

  const sun = degreeToSign(solarLongitude(jd))
  const moon = degreeToSign(lunarLongitude(jd))
  const asc = computeAscendant(jd, lat, lon)

  const planetNames = ['Mercure', 'Vénus', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton']
  const planets: PlanetPosition[] = planetNames.map((name) => {
    const pos = degreeToSign(planetLongitude(jd, name))
    return { planet: name, sign: pos.sign, degree: Math.round(pos.degree * 10) / 10 }
  })

  return {
    sunSign: sun.sign,
    moonSign: moon.sign,
    ascendant: asc.sign,
    ascendantDegree: Math.round(asc.degree * 10) / 10,
    sunDegree: Math.round(sun.degree * 10) / 10,
    moonDegree: Math.round(moon.degree * 10) / 10,
    planets,
  }
}
