import { assertAdminAccess } from '../../../utils/admin-auth'
import { getAdminAffiliatesDashboard } from '../../../utils/affiliate'

export default defineEventHandler(async (event) => {
  assertAdminAccess(event)
  return getAdminAffiliatesDashboard()
})
