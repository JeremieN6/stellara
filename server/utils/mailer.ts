import nodemailer from 'nodemailer'

interface SendMailOptions {
  to: string
  subject: string
  html: string
  text: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

type SendMailResult = {
  sent: boolean
  reason?: string
}

let transporter: nodemailer.Transporter | null = null
let cachedConfigKey = ''

function getTransportConfig() {
  const config = useRuntimeConfig()
  const host = String(config.emailHost || '').trim()
  const port = Number(config.emailPort || 587)
  const user = String(config.emailUser || '').trim()
  const pass = String(config.emailPass || '').trim()
  const from = String(config.emailFrom || '').trim()

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: port === 465,
  }
}

function getTransporter() {
  const cfg = getTransportConfig()

  if (!cfg.host || !cfg.user || !cfg.pass || !Number.isFinite(cfg.port)) {
    return {
      transporter: null,
      reason: 'smtp_not_configured',
      fromAddress: cfg.user || 'no-reply@stellara.app',
    }
  }

  const key = `${cfg.host}:${cfg.port}:${cfg.user}`
  if (!transporter || cachedConfigKey !== key) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
    })
    cachedConfigKey = key
  }

  return {
    transporter,
    reason: '',
    fromAddress: cfg.from || cfg.user,
  }
}

export async function sendPreviewEmail(options: SendMailOptions): Promise<SendMailResult> {
  const transport = getTransporter()
  if (!transport.transporter) {
    return { sent: false, reason: transport.reason }
  }

  try {
    await transport.transporter.sendMail({
      from: `Stellara <${transport.fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    })

    return { sent: true }
  } catch (error) {
    console.error('[mailer] send failed:', error)
    return { sent: false, reason: 'smtp_send_failed' }
  }
}
