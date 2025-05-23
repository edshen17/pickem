import process from 'node:process'
import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'
import { adminRoles } from '~/view-models/role'
import { poolValidator } from '~/validators/pool'
import { poolRepository } from '~/repositories/pool-repository'
import { encrypt } from '~/utils/encrypt'

export default authenticated(async ({ user, event }) => {
  AuthGuard.availableFor(user, adminRoles)

  const poolId = event.context.params?.id ?? throwError('Pool id required')
  const isNewPool = poolId === 'new'

  // TODO: validate entryStartDate relative to entry close date
  const { currency, entryFee, auth, isPubliclyWatchable, maxNumberOfPlayers, numberOfPicks, poolAllocation, prizeAllocation, tournamentId, eventId, entryStartDate, name }
    = await readValidatedBody(event, body => poolValidator.parse(body))

  if (!isNewPool) {
    const { number_of_entries } = await poolRepository.findById(poolId) ?? throwError('Pool not found')
    if (number_of_entries > 0) {
      throwError('Cannot modify pool after entries have been submitted')
    }
  }

  const { isPrivateLeague, password } = auth

  const values = {
    name: name || null,
    currency,
    entry_fee: entryFee,
    is_private: isPrivateLeague,
    is_publicly_watchable: isPubliclyWatchable,
    max_players: maxNumberOfPlayers,
    number_of_picks: numberOfPicks,
    password: isPrivateLeague
      ? encrypt(password ?? throwError('Password required'), process.env.CRYPTO_SECRET_KEY ?? throwError('Secret key required'))
      : null,
    pool_allocation: poolAllocation,
    prize_allocation: prizeAllocation,
    tournament_id: tournamentId,
    event_id: eventId,
    entry_start_date: entryStartDate,
  }

  const { id } = !isNewPool ? await poolRepository.updateById(poolId, values, user) : await poolRepository.insert(values, user)

  return id
})
