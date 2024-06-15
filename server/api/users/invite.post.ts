import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'
import { inviteUserValidator } from '~/validators/user'
import { adminRoles } from '~/view-models/role'
import { serverSupabaseServiceRole } from '#supabase/server'
import { throwNotFoundError } from '~/server/utils/errors/common'
import { userRepository } from '~/repositories/user-repository'
import { createUserFromSupabase } from '~/server/api/users/index.get'
import { hostClubMemberRepository } from '~/repositories/host-club-member-repository'

export default authenticated(async ({ user, event }) => {
  AuthGuard.availableFor(user, adminRoles)

  const { email, roleId } = await readValidatedBody(event, body => inviteUserValidator.parse(body))
  const redirectTo = `${useRuntimeConfig().public.baseUrl}/sign-up`
  const client = serverSupabaseServiceRole(event)

  if (!user || !user.host_club)
    throwNotFoundError('User or host club not found')

  const {
    data: { user: invitedSupabaseUser },
    error,
  } = await client.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: { hostClubId: user.host_club.id },
  })

  if (error || invitedSupabaseUser === null)
    throwNotFoundError(`Unable to invite ${email}`)

  const invitedUser = await userRepository.findById(invitedSupabaseUser.id)
  // do transaction here
  if (!invitedUser)
    await createUserFromSupabase(invitedSupabaseUser)

  const invitedHostClubMember = await hostClubMemberRepository.findByHostClubAndUser(user.host_club.id, invitedSupabaseUser.id)

  if (!invitedHostClubMember) {
    await hostClubMemberRepository.insert({
      user_id: invitedSupabaseUser.id,
      host_club_id: user.host_club.id,
      role_id: roleId,
    }, user)
  }
})
