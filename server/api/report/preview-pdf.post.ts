import { buildPreviewPdfBuffer, type PreviewPdfPayload } from '../../utils/report-preview-pdf'

export default defineEventHandler(async (event) => {
  const body = await readBody<PreviewPdfPayload>(event)
  const pdfBuffer = buildPreviewPdfBuffer(body)

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', 'attachment; filename="apercu-theme-stellara.pdf"')
  setHeader(event, 'Cache-Control', 'no-store')

  return pdfBuffer
})
