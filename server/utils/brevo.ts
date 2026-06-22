type BrevoContactPayload = {
  email: string
  prenom: string
  signeAstro: string
  lune: string
  ascendant: string
}

type BrevoSyncResult = {
  synced: boolean
  reason?: string
}

function getBrevoConfig() {
  const config = useRuntimeConfig()
  const apiKey = String(config.brevoApiKey || '').trim()
  const listIdRaw = String(config.brevoListIdLeads || '').trim()
  const listId = Number.parseInt(listIdRaw, 10)

  return {
    apiKey,
    listId: Number.isFinite(listId) ? listId : null,
  }
}

export async function syncContactToBrevo(payload: BrevoContactPayload): Promise<BrevoSyncResult> {
  const config = getBrevoConfig()

  if (!config.apiKey || config.listId === null) {
    return { synced: false, reason: 'brevo_not_configured' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        attributes: {
          PRENOM: payload.prenom,
          SIGNE_ASTRO: payload.signeAstro,
          LUNE: payload.lune,
          ASCENDANT: payload.ascendant || 'Non calculé',
        },
        listIds: [config.listId],
        updateEnabled: true,
      }),
    })

    if (!response.ok) {
      const responseText = await response.text().catch(() => '')
      console.error('[brevo] sync failed:', response.status, responseText)
      return {
        synced: false,
        reason: `brevo_http_${response.status}`,
      }
    }

    return { synced: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[brevo] sync failed:', message)
    return {
      synced: false,
      reason: 'brevo_request_failed',
    }
  } finally {
    clearTimeout(timeout)
  }
}