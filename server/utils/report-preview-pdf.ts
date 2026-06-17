export interface PreviewPdfPayload {
  firstName?: string
  birthDate?: string
  city?: string
  sunSign?: string
  moonSign?: string
  ascendant?: string
  summary?: string
}

function toAscii(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .trim()
}

function escapePdfText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maxChars) {
      line = candidate
    } else {
      if (line) lines.push(line)
      line = word
    }
  }

  if (line) lines.push(line)
  return lines
}

function buildSimplePdf(lines: string[]): Buffer {
  const contentLines = [
    'BT',
    '/F1 16 Tf',
    '50 790 Td',
  ]

  lines.forEach((line, index) => {
    const escaped = escapePdfText(line)
    if (index === 0) {
      contentLines.push(`(${escaped}) Tj`)
    } else {
      contentLines.push('0 -20 Td')
      contentLines.push(`(${escaped}) Tj`)
    }
  })

  contentLines.push('ET')
  const streamContent = `${contentLines.join('\n')}\n`

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(streamContent, 'latin1')} >>\nstream\n${streamContent}endstream\nendobj\n`,
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []

  objects.forEach((objectContent) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'))
    pdf += objectContent
  })

  const xrefStart = Buffer.byteLength(pdf, 'latin1')
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'

  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
  })

  pdf += 'trailer\n'
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += 'startxref\n'
  pdf += `${xrefStart}\n`
  pdf += '%%EOF'

  return Buffer.from(pdf, 'latin1')
}

export function buildPreviewPdfBuffer(payload: PreviewPdfPayload): Buffer {
  const firstName = toAscii(payload.firstName || 'Votre theme natal')
  const city = toAscii(payload.city || 'Ville non renseignee')
  const birthDate = toAscii(payload.birthDate || 'Date non renseignee')
  const sunSign = toAscii(payload.sunSign || 'Inconnu')
  const moonSign = toAscii(payload.moonSign || 'Inconnu')
  const ascendant = toAscii(payload.ascendant || 'Inconnu')
  const summary = toAscii(payload.summary || 'Resume indisponible.')

  const lines = [
    `Apercu du theme de ${firstName}`,
    `Date de naissance: ${birthDate}`,
    `Ville: ${city}`,
    `Soleil: ${sunSign} | Lune: ${moonSign} | Ascendant: ${ascendant}`,
    '',
    ...wrapText(summary, 88).slice(0, 16),
    '',
    'Version premium disponible sur stellara.fr',
  ]

  return buildSimplePdf(lines)
}