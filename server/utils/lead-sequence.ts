import { and, asc, count, eq, inArray, isNotNull, lte, max, ne, sql } from 'drizzle-orm'
import { leadMagnetContacts, leadMagnetEmailEvents, reports } from '../../db/schema'
import { getDbOrThrow } from './db'
import { sendPreviewEmail } from './mailer'

type ContactRow = typeof leadMagnetContacts.$inferSelect

type SequenceTemplate = {
  step: number
  templateKey: string
  offsetDays: number
  subject: (contact: ContactRow) => string
  html: (contact: ContactRow) => string
  text: (contact: ContactRow) => string
}

type DashboardContact = {
  id: string
  email: string
  firstName: string | null
  currentStep: number
  sentEmailsCount: number
  converted: boolean
  isSequenceCompleted: boolean
  nextEmailDueAt: string | null
  lastEmailSentAt: string | null
  createdAt: string
  updatedAt: string
}

type DashboardStats = {
  totalContacts: number
  convertedCount: number
  activeSequenceCount: number
  completedSequenceCount: number
  dueNowCount: number
}

function normalizeName(value: string | null): string {
  if (!value) return 'vous'
  const trimmed = value.trim()
  return trimmed || 'vous'
}

function normalizeMoonSign(value: string | null): string {
  const trimmed = (value || '').trim()
  return trimmed || 'votre signe'
}

function addDays(date: Date, days: number): Date {
  const output = new Date(date)
  output.setUTCDate(output.getUTCDate() + days)
  return output
}

const SEQUENCE_TEMPLATES: SequenceTemplate[] = [
  {
    step: 0,
    templateKey: 'welcome-report',
    offsetDays: 0,
    subject: (contact) => `Ton theme natal t'attend, ${normalizeName(contact.firstName)}`,
    text: (contact) => {
      const firstName = normalizeName(contact.firstName)
      return `${firstName},\n\nTon apercu est pret. Tu peux retrouver ton rapport tronque sur Stellara et reprendre la lecture la ou tu t'es arrete(e).\n\nCe que tu as deja: Soleil, Lune, Ascendant, premiere maison et resume personnalise.\n\nA tres vite,\nStellara`
    },
    html: (contact) => {
      const firstName = normalizeName(contact.firstName)
      return `<p>Bonjour ${firstName},</p><p>Ton apercu est pret. Tu peux retrouver ton rapport tronque sur Stellara et reprendre la lecture la ou tu t'es arrete(e).</p><p>Ce que tu as deja: Soleil, Lune, Ascendant, premiere maison et resume personnalise.</p><p>A tres vite,<br>Stellara</p>`
    },
  },
  {
    step: 1,
    templateKey: 'moon-emotions',
    offsetDays: 1,
    subject: (contact) => `Ce que ta Lune en ${normalizeMoonSign(contact.moonSign)} dit de tes emotions`,
    text: (contact) => {
      const sign = normalizeMoonSign(contact.moonSign)
      return `Ta Lune en ${sign} donne des indices tres utiles sur ta securite emotionnelle, tes besoins affectifs et tes reactions instinctives.\n\nDans ton rapport complet, on detaille aussi l'impact de tes aspects planetaires sur cette dynamique intime.\n\nVoir mon rapport complet: ${getCheckoutLink()}`
    },
    html: (contact) => {
      const sign = normalizeMoonSign(contact.moonSign)
      return `<p>Ta Lune en <strong>${sign}</strong> donne des indices tres utiles sur ta securite emotionnelle, tes besoins affectifs et tes reactions instinctives.</p><p>Dans ton rapport complet, on detaille aussi l'impact de tes aspects planetaires sur cette dynamique intime.</p><p><a href="${getCheckoutLink()}">Voir mon rapport complet</a></p>`
    },
  },
  {
    step: 2,
    templateKey: 'houses-teaser',
    offsetDays: 3,
    subject: () => 'Le placement que tout le monde ignore dans son theme',
    text: () => `La plupart des gens regardent seulement leur signe solaire. Pourtant, les maisons astrologiques racontent ou se jouent concretement tes enjeux: travail, couple, argent, vocation.\n\nTon apercu n'en montre qu'une partie. Le rapport complet decode les 12 maisons.\n\nDebloquer la lecture complete: ${getCheckoutLink()}`,
    html: () => `<p>La plupart des gens regardent seulement leur signe solaire. Pourtant, les maisons astrologiques racontent ou se jouent concretement tes enjeux: travail, couple, argent, vocation.</p><p>Ton apercu n'en montre qu'une partie. Le rapport complet decode les 12 maisons.</p><p><a href="${getCheckoutLink()}">Debloquer la lecture complete</a></p>`,
  },
  {
    step: 3,
    templateKey: 'transits-premium',
    offsetDays: 5,
    subject: () => 'Ce que les planetes disent de ta periode actuelle',
    text: () => `Ton theme natal explique qui tu es. Les transits expliquent ce que tu traverses maintenant.\n\nC'est exactement la couche qui fait la difference pour prendre des decisions justes au bon moment.\n\nDecouvrir Orbite Premium: ${getCheckoutLink()}`,
    html: () => `<p>Ton theme natal explique qui tu es. Les transits expliquent ce que tu traverses maintenant.</p><p>C'est exactement la couche qui fait la difference pour prendre des decisions justes au bon moment.</p><p><a href="${getCheckoutLink()}">Decouvrir Orbite Premium</a></p>`,
  },
  {
    step: 4,
    templateKey: 'limited-offer',
    offsetDays: 7,
    subject: () => 'Ton rapport complet - offre limitee',
    text: () => `Dernier rappel: ton offre decouverte est active pendant 48h.\n\nCarte Natale complete: 9,99 EUR -> 7,99 EUR\n\nAcceder a l'offre: ${getCheckoutLink()}`,
    html: () => `<p>Dernier rappel: ton offre decouverte est active pendant 48h.</p><p><strong>Carte Natale complete: 9,99 EUR -> 7,99 EUR</strong></p><p><a href="${getCheckoutLink()}">Acceder a l'offre</a></p>`,
  },
]

function getTemplateForStep(step: number): SequenceTemplate | null {
  return SEQUENCE_TEMPLATES.find((template) => template.step === step) || null
}

function getCheckoutLink(): string {
  const config = useRuntimeConfig()
  const publicLink = String(config.public?.stripeOneShotLink || '').trim()
  if (publicLink) return publicLink
  return String(config.stripeBuyLink || '').trim() || 'https://stellara.app/rapport'
}

export async function upsertLeadMagnetContact(payload: {
  email: string
  firstName?: string | null
  moonSign?: string | null
  reportId?: string | null
}) {
  const db = getDbOrThrow()
  const now = new Date()
  const normalizedEmail = payload.email.trim().toLowerCase()

  const [contact] = await db
    .insert(leadMagnetContacts)
    .values({
      email: normalizedEmail,
      firstName: payload.firstName || null,
      moonSign: payload.moonSign || null,
      reportId: payload.reportId || null,
      currentStep: 0,
      sentEmailsCount: 0,
      nextEmailDueAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: leadMagnetContacts.email,
      set: {
        firstName: payload.firstName || null,
        moonSign: payload.moonSign || null,
        reportId: payload.reportId || null,
        updatedAt: now,
      },
    })
    .returning()

  return contact
}

export async function markLeadAsConvertedByEmail(email: string) {
  const db = getDbOrThrow()
  const now = new Date()
  const normalizedEmail = email.trim().toLowerCase()

  await db
    .update(leadMagnetContacts)
    .set({
      converted: true,
      convertedAt: now,
      updatedAt: now,
    })
    .where(eq(leadMagnetContacts.email, normalizedEmail))
}

export async function markLeadAsConvertedByReportId(reportId: string) {
  const db = getDbOrThrow()
  const now = new Date()

  await db
    .update(leadMagnetContacts)
    .set({
      converted: true,
      convertedAt: now,
      updatedAt: now,
    })
    .where(eq(leadMagnetContacts.reportId, reportId))
}

export async function scheduleLeadSequenceFromReport(reportId: string) {
  const db = getDbOrThrow()
  const now = new Date()

  const [row] = await db
    .select({
      email: reports.email,
      firstName: reports.firstName,
      moonSign: reports.moonSign,
      id: reports.id,
    })
    .from(reports)
    .where(and(eq(reports.id, reportId), isNotNull(reports.email)))
    .limit(1)

  if (!row?.email) return null

  return upsertLeadMagnetContact({
    email: row.email,
    firstName: row.firstName,
    moonSign: row.moonSign,
    reportId: row.id,
  }).then(async (contact) => {
    await db
      .update(leadMagnetContacts)
      .set({
        nextEmailDueAt: now,
        updatedAt: now,
      })
      .where(eq(leadMagnetContacts.id, contact.id))
    return contact
  })
}

export async function runLeadSequenceBatch(limit = 50) {
  const db = getDbOrThrow()
  const now = new Date()

  const dueContacts = await db
    .select()
    .from(leadMagnetContacts)
    .where(
      and(
        eq(leadMagnetContacts.converted, false),
        eq(leadMagnetContacts.isSequenceCompleted, false),
        lte(leadMagnetContacts.nextEmailDueAt, now),
      ),
    )
    .orderBy(asc(leadMagnetContacts.nextEmailDueAt))
    .limit(limit)

  let sent = 0
  let failed = 0

  for (const contact of dueContacts) {
    const template = getTemplateForStep(contact.currentStep)

    if (!template) {
      await db
        .update(leadMagnetContacts)
        .set({
          isSequenceCompleted: true,
          updatedAt: now,
        })
        .where(eq(leadMagnetContacts.id, contact.id))
      continue
    }

    const sendResult = await sendPreviewEmail({
      to: contact.email,
      subject: template.subject(contact),
      html: template.html(contact),
      text: template.text(contact),
    })

    if (!sendResult.sent) {
      failed += 1

      await db
        .insert(leadMagnetEmailEvents)
        .values({
          contactId: contact.id,
          step: template.step,
          templateKey: template.templateKey,
          subject: template.subject(contact),
          status: 'failed',
          errorMessage: sendResult.reason || 'unknown_error',
        })
        .onConflictDoUpdate({
          target: [leadMagnetEmailEvents.contactId, leadMagnetEmailEvents.step],
          set: {
            status: 'failed',
            errorMessage: sendResult.reason || 'unknown_error',
            subject: template.subject(contact),
          },
        })

      await db
        .update(leadMagnetContacts)
        .set({
          lastError: sendResult.reason || 'unknown_error',
          nextEmailDueAt: addDays(now, 1),
          updatedAt: now,
        })
        .where(eq(leadMagnetContacts.id, contact.id))

      continue
    }

    sent += 1
    const nextStep = contact.currentStep + 1
    const nextTemplate = getTemplateForStep(nextStep)

    await db
      .insert(leadMagnetEmailEvents)
      .values({
        contactId: contact.id,
        step: template.step,
        templateKey: template.templateKey,
        subject: template.subject(contact),
        status: 'sent',
        sentAt: now,
      })
      .onConflictDoUpdate({
        target: [leadMagnetEmailEvents.contactId, leadMagnetEmailEvents.step],
        set: {
          status: 'sent',
          errorMessage: null,
          sentAt: now,
          subject: template.subject(contact),
        },
      })

    await db
      .update(leadMagnetContacts)
      .set({
        currentStep: nextStep,
        sentEmailsCount: contact.sentEmailsCount + 1,
        lastEmailSentAt: now,
        lastError: null,
        isSequenceCompleted: nextTemplate ? false : true,
        nextEmailDueAt: nextTemplate ? addDays(now, nextTemplate.offsetDays - template.offsetDays) : now,
        updatedAt: now,
      })
      .where(eq(leadMagnetContacts.id, contact.id))
  }

  return {
    processed: dueContacts.length,
    sent,
    failed,
  }
}

export async function getLeadSequenceDashboard(limit = 100): Promise<{
  stats: DashboardStats
  contacts: DashboardContact[]
}> {
  const db = getDbOrThrow()
  const now = new Date()

  const [totals] = await db
    .select({
      totalContacts: count(leadMagnetContacts.id),
      convertedCount: sql<number>`count(*) FILTER (WHERE ${leadMagnetContacts.converted} = true)`,
      activeSequenceCount: sql<number>`count(*) FILTER (WHERE ${leadMagnetContacts.converted} = false AND ${leadMagnetContacts.isSequenceCompleted} = false)`,
      completedSequenceCount: sql<number>`count(*) FILTER (WHERE ${leadMagnetContacts.isSequenceCompleted} = true)`,
      dueNowCount: sql<number>`count(*) FILTER (WHERE ${leadMagnetContacts.converted} = false AND ${leadMagnetContacts.isSequenceCompleted} = false AND ${leadMagnetContacts.nextEmailDueAt} <= ${now})`,
    })
    .from(leadMagnetContacts)

  const contactsRaw = await db
    .select()
    .from(leadMagnetContacts)
    .orderBy(sql`${leadMagnetContacts.createdAt} desc`)
    .limit(limit)

  const contacts: DashboardContact[] = contactsRaw.map((row) => ({
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    currentStep: row.currentStep,
    sentEmailsCount: row.sentEmailsCount,
    converted: row.converted,
    isSequenceCompleted: row.isSequenceCompleted,
    nextEmailDueAt: row.nextEmailDueAt ? row.nextEmailDueAt.toISOString() : null,
    lastEmailSentAt: row.lastEmailSentAt ? row.lastEmailSentAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }))

  return {
    stats: {
      totalContacts: Number(totals?.totalContacts || 0),
      convertedCount: Number(totals?.convertedCount || 0),
      activeSequenceCount: Number(totals?.activeSequenceCount || 0),
      completedSequenceCount: Number(totals?.completedSequenceCount || 0),
      dueNowCount: Number(totals?.dueNowCount || 0),
    },
    contacts,
  }
}

export async function getLeadEmailEvents(contactIds: string[]) {
  if (contactIds.length === 0) return [] as Array<typeof leadMagnetEmailEvents.$inferSelect>

  const db = getDbOrThrow()
  return db
    .select()
    .from(leadMagnetEmailEvents)
    .where(inArray(leadMagnetEmailEvents.contactId, contactIds))
    .orderBy(asc(leadMagnetEmailEvents.step), asc(leadMagnetEmailEvents.createdAt))
}

export async function getLatestSentStepByContact(contactIds: string[]) {
  if (contactIds.length === 0) return [] as Array<{ contactId: string; maxStep: number | null }>

  const db = getDbOrThrow()
  return db
    .select({
      contactId: leadMagnetEmailEvents.contactId,
      maxStep: max(leadMagnetEmailEvents.step),
    })
    .from(leadMagnetEmailEvents)
    .where(and(inArray(leadMagnetEmailEvents.contactId, contactIds), eq(leadMagnetEmailEvents.status, 'sent')))
    .groupBy(leadMagnetEmailEvents.contactId)
}
