import { eq } from 'drizzle-orm'
import { reports } from '../../../db/schema'
import { getDbIfConfigured } from '../../utils/db'
import { buildPreviewPdfBuffer, type PreviewPdfPayload } from '../../utils/report-preview-pdf'
import { sendPreviewEmail } from '../../utils/mailer'

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
  if (!db || !reportId) {
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
    subject: 'Votre apercu de theme natal - Stellara',
    text: `${firstName}, voici votre apercu tronque de theme natal en piece jointe. Pour debloquer la lecture complete, revenez sur Stellara et activez le rapport premium.`,
    html: `<p>Bonjour ${firstName},</p><p>Voici votre apercu tronque de theme natal en piece jointe.</p><p>Pour debloquer la lecture complete, revenez sur Stellara et activez le rapport premium.</p><p>A bientot,<br>Stellara</p>`,
    attachments: [
      {
        filename: 'apercu-theme-stellara.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })
}
