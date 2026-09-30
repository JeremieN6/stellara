import { and, desc, eq } from 'drizzle-orm'
import tzLookup from 'tz-lookup'
import { reports } from '../../../db/schema'
import { buildNatalChart } from '../../utils/astro'
import { getDbOrThrow } from '../../utils/db'
import { generateFallbackHouseReadings, normalizeHouseReadings } from '../../utils/report-readings'
import { buildThematicSections } from '../../utils/report-sections'
import { localDateTimeToUtc } from '../../utils/timezone'

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
  const sections = buildThematicSections(chart, report.sections)

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
      sections,
      fullAnalysis: null,
    },
  }
})

