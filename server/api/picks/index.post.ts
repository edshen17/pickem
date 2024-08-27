import { z } from 'zod'
import { pickRepository } from '~/repositories/pick-repository'
import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'

const validator = z.object({
  poolId: z.string().uuid(),
  playerIds: z.array(z.string()),
})

export default authenticated(async ({ user, event }) => {
  AuthGuard.requireUser(user)

  const { poolId, playerIds } = await readValidatedBody(event, body => validator.parse(body))

  const existingPick = await pickRepository.findByPoolAndUser(user.id, poolId)

  const pick = existingPick
    ? await pickRepository.updateById(existingPick.id, { player_ids: playerIds }, user)
    : await pickRepository.insert({ user_id: user.id, pool_id: poolId, player_ids: playerIds }, user)

  return pick
})
