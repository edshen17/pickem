import type { User } from '@supabase/supabase-js'
import { userRepository } from '~/repositories/user-repository'
import { authenticated } from '~/server/utils/middleware/auth'

// used for google login
export async function createUserFromSupabase(supabaseUser: User) {
  const { id, email, user_metadata } = supabaseUser
  if (!email)
    throwError('Email required')

  return await userRepository.insert({
    id,
    name: user_metadata.name ?? user_metadata.full_name ?? email.split('@')[0],
    email,
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
