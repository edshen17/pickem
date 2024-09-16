import { z } from 'zod'
import { pickRepository } from '~/repositories/pick-repository'
import { poolRepository } from '~/repositories/pool-repository'
import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'

const validator = z.object({
  id: z.string().uuid().optional(),
  poolId: z.string().uuid(),
  playerIds: z.array(z.string()),
})

export default authenticated(async ({ user, event }) => {
  AuthGuard.requireUser(user)

  const { id, poolId, playerIds } = await readValidatedBody(event, body => validator.parse(body))

  const [pool, existingPick] = await Promise.all([
    poolRepository.findById(poolId),
    ...(id ? [pickRepository.findById(id)] : []),
  ])

  if (!pool)
    throwNotFoundError('Pool not found')

  if (Number(pool.number_of_picks) !== playerIds.length)
    throwError('Number of picks mismatch')

  const formattedPlayerIds = JSON.stringify(playerIds)

  const pick = existingPick
    ? await pickRepository.updateById(existingPick.id, { player_ids: formattedPlayerIds }, user)
    : await pickRepository.insert({ user_id: user.id, pool_id: poolId, player_ids: formattedPlayerIds }, user)

  return {
    id: pick.id,
    playerIds,
    updatedAt: pick.updated_at,
    createdAt: pick.created_at,
  }
})
