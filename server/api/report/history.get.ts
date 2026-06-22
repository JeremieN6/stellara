import { and, desc, eq } from 'drizzle-orm'
import { reports } from '../../../db/schema'
import { getDbOrThrow } from '../../utils/db'
import { readAccountSessionEmail } from '../../utils/auth-session'

export default defineEventHandler(async (event) => {
  const sessionEmail = readAccountSessionEmail(event)
  const queryEmail = String(getQuery(event).email || '').trim().toLowerCase()
  const email = sessionEmail || queryEmail

  if (!email) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const db = getDbOrThrow(event)
  const rows = await db
    .select({
      id: reports.id,
      firstName: reports.firstName,
      birthDate: reports.birthDate,
      city: reports.city,
      sunSign: reports.sunSign,
      moonSign: reports.moonSign,
      ascendant: reports.ascendant,
      isPremium: reports.isPremium,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .where(and(eq(reports.email, email)))
    .orderBy(desc(reports.createdAt))
    .limit(50)

  return {
    email,
    reports: rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
  }
})
