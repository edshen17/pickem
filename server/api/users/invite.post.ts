import { userRepository } from '~/repositories/user-repository'

export default defineEventHandler(async (event) => {
  const { supabaseUser } = await protectRoute(event)

  if (!supabaseUser.email)
    throw createError({ statusCode: 401, message: 'Unauthorized' })
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
