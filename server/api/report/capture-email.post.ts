import { eq } from 'drizzle-orm'
import { reports } from '../../../db/schema'
import { syncContactToBrevo } from '../../utils/brevo'
import { getDbIfConfigured } from '../../utils/db'
import { buildPreviewPdfBuffer, type PreviewPdfPayload } from '../../utils/report-preview-pdf'
import { sendPreviewEmail } from '../../utils/mailer'
import { runLeadSequenceBatch, upsertLeadMagnetContact } from '../../utils/lead-sequence'

interface CaptureEmailRequest {
  reportId?: string
  email?: string
  previewPayload?: PreviewPdfPayload
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CaptureEmailRequest>(event)
  const email = (body.email || '').trim().toLowerCase()
  const reportId = (body.reportId || '').trim()

  if (!email || !isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address.',
    })
  }

  const db = getDbIfConfigured(event)

  let moonSign: string | null = null
  if (db && reportId) {
    try {
      const [reportRow] = await db
        .select({ moonSign: reports.moonSign })
        .from(reports)
        .where(eq(reports.id, reportId))
        .limit(1)
      moonSign = reportRow?.moonSign || null
    } catch (moonSignError) {
      console.error('[report/capture-email] moon sign lookup failed:', moonSignError)
    }
  }

  if (!db || !reportId) {
    try {
      await upsertLeadMagnetContact({
        email,
        firstName: body.previewPayload?.firstName ?? null,
        moonSign,
        reportId: reportId || null,
      })
      await syncContactToBrevo({
        email,
        prenom: body.previewPayload?.firstName ?? 'vous',
        signeAstro: body.previewPayload?.sunSign ?? 'Non calculé',
        lune: body.previewPayload?.moonSign ?? 'Non calculé',
        ascendant: body.previewPayload?.ascendant ?? 'Non calculé',
      })
      await runLeadSequenceBatch(20)
    } catch (sequenceError) {
      console.error('[report/capture-email] lead sequence upsert failed (fallback path):', sequenceError)
    }

    const sendResult = await sendPreviewByEmail(email, body.previewPayload)
    return {
      ok: true,
      persisted: false,
      emailSent: sendResult.sent,
      emailFallbackReason: sendResult.reason || null,
    }
  }

  try {
    await db.update(reports)
      .set({ email })
      .where(eq(reports.id, reportId))
  } catch (error) {
    console.error('[report/capture-email] DB update failed:', error)
  }

  try {
    await upsertLeadMagnetContact({
      email,
      firstName: body.previewPayload?.firstName ?? null,
      moonSign,
      reportId,
    })
    await syncContactToBrevo({
      email,
      prenom: body.previewPayload?.firstName ?? 'vous',
      signeAstro: body.previewPayload?.sunSign ?? 'Non calculé',
      lune: body.previewPayload?.moonSign ?? 'Non calculé',
      ascendant: body.previewPayload?.ascendant ?? 'Non calculé',
    })
    await runLeadSequenceBatch(20)
  } catch (sequenceError) {
    console.error('[report/capture-email] lead sequence upsert failed:', sequenceError)
  }

  const sendResult = await sendPreviewByEmail(email, body.previewPayload)
  return {
    ok: true,
    persisted: true,
    emailSent: sendResult.sent,
    emailFallbackReason: sendResult.reason || null,
  }
})

async function sendPreviewByEmail(email: string, payload?: PreviewPdfPayload) {
  if (!payload) {
    return { sent: false, reason: 'missing_preview_payload' }
  }

  const pdfBuffer = buildPreviewPdfBuffer(payload)
  const firstName = (payload.firstName || 'vous').trim()

  return sendPreviewEmail({
    to: email,
    subject: 'Votre aperçu de theme natal - Stellara',
    text: `${firstName}, voici votre aperçu tronque de theme natal en piece jointe. Pour debloquer la lecture complete, revenez sur Stellara et activez le rapport premium.`,
    html: `<p>Bonjour ${firstName},</p><p>Voici votre aperçu tronque de theme natal en piece jointe.</p><p>Pour debloquer la lecture complete, revenez sur Stellara et activez le rapport premium.</p><p>A bientot,<br>Stellara</p>`,
    attachments: [
      {
        filename: 'apercu-theme-stellara.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })
}
