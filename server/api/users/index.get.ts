import { userRepository } from '~/repositories/user-repository'
import type { AuthenticatedEvent } from '~/server/middleware/auth'
import { authenticated } from '~/server/middleware/auth'
import { throwUnauthorizedError } from '~/server/utils/errors/common'
import { IUser } from '~/view-models/user-view'

export default authenticated(async (event: AuthenticatedEvent, user: IUser) => {
  const { supabaseUser } = await protectRoute(event)

  if (!supabaseUser.email)
    throwUnauthorizedError()
  let existingUser = await userRepository.findByIdWithHostClub(supabaseUser.id)

  if (!existingUser) {
    // TODO: unify insert and join
    await userRepository.insert({
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name ?? supabaseUser.email?.split('@')[0],
      email: supabaseUser.email,
    }, supabaseUser)
    existingUser = await userRepository.findByIdWithHostClub(supabaseUser.id)
  }

  return existingUser
})
