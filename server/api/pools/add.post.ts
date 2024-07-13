import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'
import { adminRoles } from '~/view-models/role'
import { poolValidator } from '~/validators/pool'
import { poolRepository } from '~/repositories/pool-repository'

export default authenticated(async ({ user, event }) => {
  AuthGuard.availableFor(user, adminRoles)

  const { currency, entryFee, auth, isPubliclyWatchable, maxNumberOfPlayers, numberOfPicks, poolAllocation, prizeAllocation }
    = await readValidatedBody(event, body => poolValidator.parse(body))

  const { isPrivateLeague, password } = auth

  const poolId = event.context.params?.id

  const values = {
    currency,
    entry_fee: entryFee,
    is_private: isPrivateLeague,
    is_publicly_watchable: isPubliclyWatchable,
    max_players: maxNumberOfPlayers,
    number_of_picks: numberOfPicks,
    password: isPrivateLeague ? password : null,
    pool_allocation: poolAllocation,
    prize_allocation: prizeAllocation,
    name: '', // TODO: fill name + description?
  }

  if (!user)
    throwUnauthorizedError('User required')

  if (poolId && poolId !== 'new')
    await poolRepository.updateById(poolId, values, user)
  else
    await poolRepository.insert(values, user)
})
