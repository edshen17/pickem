import type { User } from '@supabase/supabase-js'
import { userRepository } from '~/repositories/user-repository'
import { authenticated } from '~/server/utils/middleware/auth'

export async function createUserFromSupabase(supabaseUser: User) {
  if (!supabaseUser.email)
    throwError('Email required')

  return await userRepository.insert({
    id: supabaseUser.id,
    name: supabaseUser.user_metadata.full_name ?? supabaseUser.email.split('@')[0],
    email: supabaseUser.email,
  }, supabaseUser)
}

export default authenticated(async ({ supabaseUser, user: existingUser }) => {
  if (!existingUser) {
    // TODO: unify insert and join
    await createUserFromSupabase(supabaseUser)
    existingUser = await userRepository.findByIdWithHostClub(supabaseUser.id)
  }

  return existingUser
})
