import { and, desc, eq } from 'drizzle-orm'
import tzLookup from 'tz-lookup'
import { reports } from '../../../db/schema'
import { buildNatalChart } from '../../utils/astro'
import { getDbOrThrow } from '../../utils/db'
import { generateFallbackHouseReadings, normalizeHouseReadings } from '../../utils/report-readings'

export default defineEventHandler(async (event) => {
  const email = String(getQuery(event).email || '').trim().toLowerCase()
  const reportId = String(getQuery(event).reportId || '').trim()

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'email query param is required' })
  }

  const db = getDbOrThrow(event)
  const [report] = reportId
    ? await db
      .select()
      .from(reports)
      .where(and(eq(reports.email, email), eq(reports.id, reportId)))
      .limit(1)
    : await db
      .select()
      .from(reports)
      .where(eq(reports.email, email))
      .orderBy(desc(reports.isPremium), desc(reports.createdAt))
      .limit(1)

  if (!report) {
    return {
      report: null,
      isPremium: false,
    }
  }

  const [year, month, day] = report.birthDate.split('-').map(Number)
  const [hours, minutes] = (report.birthTime || '12:00').split(':').map(Number)
  const timezone = tzLookup(report.lat, report.lon)
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
    report.lat,
    report.lon,
  )

  const fallbackHouseReadings = generateFallbackHouseReadings(chart)
  const houseReadings = normalizeHouseReadings(report.houseReadings, fallbackHouseReadings)

  return {
    isPremium: Boolean(report.isPremium),
    report: {
      reportId: report.id,
      firstName: report.firstName,
      birthDate: report.birthDate,
      city: report.city,
      sunSign: report.sunSign,
      moonSign: report.moonSign,
      ascendant: report.ascendant,
      ascendantDegree: chart.ascendantDegree,
      planets: chart.planets,
      personalizedSummary: report.summary || '',
      summary: report.summary || '',
      houseReadings,
      fullAnalysis: null,
    },
  }
})

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
