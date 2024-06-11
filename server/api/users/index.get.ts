import { userRepository } from '~/repositories/user-repository'
import { authenticated } from '~/server/middleware/auth'

export default authenticated(async ({ supabaseUser }) => {
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
