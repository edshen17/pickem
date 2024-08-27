import { authenticated } from '~/server/utils/middleware/auth'
import { poolRepository } from '~/repositories/pool-repository'
import { toPoolWithTournamentAndPicksView } from '~/server/api/pools/conversion'

export default authenticated(async ({ user, event }) => {
  const id = event.context.params?.id ?? throwError('Id required')
  const pool = await poolRepository.findById(id) ?? throwNotFoundError('Pool not found')
  const poolWithTournamentAndPicks = await toPoolWithTournamentAndPicksView(pool, user)
  return poolWithTournamentAndPicks
})
