import { clearAccountSessionCookie } from '../../utils/auth-session'

export default defineEventHandler(async (event) => {
  clearAccountSessionCookie(event)
  return { ok: true }
})
