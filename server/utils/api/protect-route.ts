import { serverSupabaseUser } from '#supabase/server'
import { userRepository } from '~/repositories/user-repository'
import { throwUnauthorizedError } from '~/server/utils/errors/common'

export async function protectRoute(event: any) {
  const supabaseUser = await serverSupabaseUser(event)

  if (!supabaseUser)
    throwUnauthorizedError()

  const user = await userRepository.findByIdWithHostClub(supabaseUser.id)
  return { user, supabaseUser }
}
