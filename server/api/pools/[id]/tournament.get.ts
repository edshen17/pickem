import { authenticated } from '~/server/utils/middleware/auth'
import { poolRepository } from '~/repositories/pool-repository'
import { toPoolWithTournamentView } from '~/server/api/pools/conversion'

export default authenticated(async ({ event }) => {
  const id = event.context.params?.id ?? throwError('Id required')
  const pool = await poolRepository.findById(id) ?? throwNotFoundError('Pool not found')
  const poolWithTournamentAndEvent = await toPoolWithTournamentView(pool)
  return poolWithTournamentAndEvent
})
