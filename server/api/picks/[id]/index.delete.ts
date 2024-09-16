import { pickRepository } from '~/repositories/pick-repository'
import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'

export default authenticated(async ({ user, event }) => {
  AuthGuard.requireUser(user)

  const pickId = event.context.params?.id

  if (!pickId)
    throwError('Pick ID is required')

  const pick = await pickRepository.findById(pickId)

  if (!pick)
    throwNotFoundError('Pick not found')

  if (pick.user_id !== user.id)
    throwUnauthorizedError('You are not authorized to delete this pick')

  await pickRepository.deleteById(pickId)

  return { success: true }
})
