import type { Insertable } from 'kysely'
import type { Users } from 'kysely-codegen'
import { serverSupabaseClient } from '#supabase/server'
import { userRepository } from '~/repositories/user-repository'

export default defineEventHandler(async (event) => {
  const { auth } = await serverSupabaseClient(event)

  const { data: { user: supabaseUser } } = await auth.getUser(event.context.user)

  if (!supabaseUser)
    throw createError({ statusCode: 401, message: 'Unauthorized' })

  const existingUser = await userRepository.findById(supabaseUser.id)

  if (!existingUser) {
    const newUser: Insertable<Users> = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name ?? supabaseUser.email?.split('@')[0],
      created_by: supabaseUser.id,
      updated_at: new Date(),
      created_at: new Date(),
    }
    await userRepository.insert(newUser)
  }

  return { statusCode: 200, message: 'Success' }
})
