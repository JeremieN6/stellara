import { readAccountSessionEmail } from '../../utils/auth-session'

export default defineEventHandler(async (event) => {
  const email = readAccountSessionEmail(event)

  return {
    authenticated: Boolean(email),
    email,
  }
})
