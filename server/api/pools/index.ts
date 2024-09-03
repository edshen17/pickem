import { authenticated } from '~/server/utils/middleware/auth'
import { poolRepository } from '~/repositories/pool-repository'
import { toPoolListView } from '~/server/api/pools/conversion'

export default authenticated(async () => {
  // TODO: filter + add pagination
  // const filter = user && hasRoles(user, adminRoles) ? {} : { is_publicly_watchable: true }
  const pools = await poolRepository.getPoolsWithEntryCount()
  const poolViews = await Promise.all(pools.map(toPoolListView))
  return poolViews
})
