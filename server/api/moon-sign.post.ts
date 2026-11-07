import tzLookup from 'tz-lookup'
import { buildNatalChart } from '../utils/astro'
import { localDateTimeToUtc } from '../utils/timezone'

interface MoonSignRequest {
  birthDate: string // YYYY-MM-DD
  birthTime: string // HH:mm
  lat: number
  lon: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MoonSignRequest>(event)

  if (!body.birthDate || !Number.isFinite(body.lat) || !Number.isFinite(body.lon)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const [year, month, day] = body.birthDate.split('-').map(Number)
  const [hours, minutes] = (body.birthTime || '12:00').split(':').map(Number)
  const timezone = tzLookup(body.lat, body.lon)
  const utcBirth = localDateTimeToUtc(year, month, day, hours, minutes, timezone)
  const utcHourDecimal =
    utcBirth.getUTCHours() +
    utcBirth.getUTCMinutes() / 60 +
    utcBirth.getUTCSeconds() / 3600

  const chart = buildNatalChart(
    utcBirth.getUTCFullYear(),
    utcBirth.getUTCMonth() + 1,
    utcBirth.getUTCDate(),
    utcHourDecimal,
    body.lat,
    body.lon,
  )

  return {
    moonSign: chart.moonSign,
    moonDegree: chart.moonDegree,
    sunSign: chart.sunSign,
  }
})
