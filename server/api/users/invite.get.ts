import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'
import { userRepository } from '~/repositories/user-repository'
import type { ISupabaseUserMetadata } from '~/server/api/users/invite.post'

const accessTokenValidator = z.string().min(1)

export default anonymous(async ({ event }) => {
  const { inviteToken } = getQuery(event)

  const parsedToken = accessTokenValidator.parse(inviteToken)

  const client = await serverSupabaseClient(event)

  const {
    data: { user },
    error,
  } = await client.auth.getUser(parsedToken)

  if (error || user === null)
    throwNotFoundError('User not found')

  const { hostClubId } = user.user_metadata as ISupabaseUserMetadata

  const invitedUser = await userRepository.findByIdWithHostClub(user.id, hostClubId)

  return invitedUser
})
