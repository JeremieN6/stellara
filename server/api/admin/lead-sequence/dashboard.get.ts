import { getLeadEmailEvents, getLeadSequenceDashboard, getLatestSentStepByContact } from '../../../utils/lead-sequence'

function assertAdminAccess(event: Parameters<typeof defineEventHandler>[0]) {
  const config = useRuntimeConfig(event)
  const expectedToken = String(config.adminToken || '').trim()

  if (!expectedToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ADMIN_TOKEN is not configured.',
    })
  }

  const authHeader = getHeader(event, 'authorization') || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  const queryToken = String(getQuery(event).token || '').trim()
  const provided = bearer || queryToken

  if (!provided || provided !== expectedToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized admin access.',
    })
  }
}

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)

  const query = getQuery(event)
  const limit = Math.min(Math.max(Number(query.limit || 100), 1), 300)

  const dashboard = await getLeadSequenceDashboard(limit)
  const contactIds = dashboard.contacts.map((contact) => contact.id)

  const [events, latestSteps] = await Promise.all([
    getLeadEmailEvents(contactIds),
    getLatestSentStepByContact(contactIds),
  ])

  const latestByContact = new Map(latestSteps.map((row) => [row.contactId, Number(row.maxStep)]))

  const eventsByContact = new Map<string, Array<{
    step: number
    templateKey: string
    subject: string
    status: string
    sentAt: string | null
    errorMessage: string | null
  }>>()

  for (const eventRow of events) {
    const list = eventsByContact.get(eventRow.contactId) || []
    list.push({
      step: eventRow.step,
      templateKey: eventRow.templateKey,
      subject: eventRow.subject,
      status: eventRow.status,
      sentAt: eventRow.sentAt ? eventRow.sentAt.toISOString() : null,
      errorMessage: eventRow.errorMessage,
    })
    eventsByContact.set(eventRow.contactId, list)
  }

  return {
    stats: dashboard.stats,
    contacts: dashboard.contacts.map((contact) => ({
      ...contact,
      latestSentStep: latestByContact.get(contact.id) ?? null,
      events: eventsByContact.get(contact.id) || [],
    })),
    sequenceDefinition: [
      { step: 0, delay: 'Immediat', label: "Ton theme natal t'attend" },
      { step: 1, delay: 'J+1', label: 'Ce que ta Lune dit de tes émotions' },
      { step: 2, delay: 'J+3', label: 'Le placement que tout le monde ignore' },
      { step: 3, delay: 'J+5', label: 'Ce que les planètes disent de ta periode' },
      { step: 4, delay: 'J+7', label: 'Ton rapport complet - offre limitée' },
    ],
  }
})
