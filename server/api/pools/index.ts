import { authenticated } from '~/server/utils/middleware/auth'
import { poolRepository } from '~/repositories/pool-repository'
import { toPoolView } from '~/server/api/pools/conversion'
import { adminRoles } from '~/view-models/role'

export default authenticated(async ({ user }) => {
  // TODO: add pagination
  const filter = user && hasRoles(user, adminRoles) ? {} : { is_publicly_watchable: true }
  const pools = await poolRepository.find(filter)
  const poolViews = pools.map(toPoolView)
  return poolViews
})
