import { serverSupabaseClient } from '#supabase/server'
import { userRepository } from '~/repositories/user-repository'

export default defineEventHandler(async (event) => {
  const { auth } = await serverSupabaseClient(event)

  const { data: { user: supabaseUser } } = await auth.getUser(event.context.user)

  if (!supabaseUser)
    throw createError({ statusCode: 401, message: 'Unauthorized' })

  const existingUser = await userRepository.findById(supabaseUser.id)

  if (!existingUser) {
    await userRepository.insert({
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name ?? supabaseUser.email?.split('@')[0],
    }, supabaseUser)
  }

  return { statusCode: 200, message: 'Success' }
})
