import dayjs from 'dayjs'
import { z } from 'zod'
import { pickRepository } from '~/repositories/pick-repository'
import { poolRepository } from '~/repositories/pool-repository'
import { toPoolWithTournamentAndPicksView } from '~/server/api/pools/conversion'
import { getTournamentById } from '~/server/api/tournaments'
import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'
import { isDateBeforeToday } from '~/utils/date'

const validator = z.object({
  id: z.string().uuid().nullable().optional(),
  poolId: z.string().uuid(),
  bracketName: z.string(),
  playerIds: z.array(z.string()),
})

export default authenticated(async ({ user, event }) => {
  AuthGuard.requireUser(user)

  const { id, poolId, playerIds, bracketName } = await readValidatedBody(event, body => validator.parse(body))

  const [pool, existingPick] = await Promise.all([
    poolRepository.findById(poolId),
    ...(id ? [pickRepository.findById(id)] : []),
  ])

  const tournament = await getTournamentById(pool.tournament_id)
  const selectedEvent = tournament.events.find(e => e.id === pool.event_id) ?? throwError('ICTTF event not found')
  const closeDate = dayjs(selectedEvent.start_date).toDate()

  if (isDateBeforeToday(closeDate))
    throwError(`Cannot edit or submit bracket after deadline`)

  if (!pool)
    throwNotFoundError('Pool not found')

  if (Number(pool.number_of_picks) !== playerIds.length)
    throwError('Number of picks mismatch')

  const formattedPlayerIds = JSON.stringify(playerIds)

  const update = { player_ids: formattedPlayerIds, name: bracketName }

  const pick = existingPick
    ? await pickRepository.updateById(existingPick.id, update, user)
    : await pickRepository.insert({ user_id: user.id, pool_id: poolId, ...update }, user)

  return {
    id: pick.id,
    playerIds,
    updatedAt: pick.updated_at,
    createdAt: pick.created_at,
    name: bracketName,
  }
})
