import type { H3Event } from 'h3'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../db/schema'

type Db = PostgresJsDatabase<typeof schema>

let sqlClient: postgres.Sql | null = null
let dbClient: Db | null = null
let dbUrlCached: string | null = null
let warnedInvalidDatabaseUrl = false

function shouldUseSsl(databaseUrl: string): boolean {
  return !/localhost|127\.0\.0\.1/i.test(databaseUrl)
}

function getDatabaseUrl(event?: H3Event): string {
  const config = useRuntimeConfig(event)
  return (config.databaseUrl || '').trim()
}

function isSupportedDatabaseUrl(databaseUrl: string): boolean {
  return /^postgres(ql)?:\/\//i.test(databaseUrl)
}

function createDb(databaseUrl: string): Db {
  sqlClient = postgres(databaseUrl, {
    ssl: shouldUseSsl(databaseUrl) ? 'require' : undefined,
    max: 1,
    prepare: false,
  })
  dbClient = drizzle(sqlClient, { schema })
  dbUrlCached = databaseUrl
  return dbClient
}

export function getDbIfConfigured(event?: H3Event): Db | null {
  const databaseUrl = getDatabaseUrl(event)
  if (!databaseUrl) return null

  if (!isSupportedDatabaseUrl(databaseUrl)) {
    if (!warnedInvalidDatabaseUrl) {
      warnedInvalidDatabaseUrl = true
      console.warn('[db] DATABASE_URL is not a PostgreSQL URL. JS persistence is disabled for this runtime.')
    }
    return null
  }

  if (dbClient && dbUrlCached === databaseUrl) {
    return dbClient
  }

  return createDb(databaseUrl)
}

export function getDbOrThrow(event?: H3Event): Db {
  const db = getDbIfConfigured(event)
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DATABASE_URL is not configured for the JS backend.',
    })
  }
  return db
}
