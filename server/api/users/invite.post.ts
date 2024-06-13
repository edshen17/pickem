import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'
import { inviteUserValidator } from '~/validators/user'
import { adminRoles } from '~/view-models/role'
import { serverSupabaseClient } from '#supabase/server'
import { throwError, throwNotFoundError } from '~/server/utils/errors/common'

export default authenticated(async ({ user, event }) => {
  AuthGuard.availableFor(user, adminRoles)

  const { email, roleId } = await readValidatedBody(event, body => inviteUserValidator.parse(body))
  const redirectTo = `${useRuntimeConfig().public.baseUrl}/sign-up`
  const client = await serverSupabaseClient(event)

  const {
    data: { user: supabaseUser },
    error,
  } = await client.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: { hostClubId: user?.host_club?.id ?? throwError('Host club id required') },
  })

  if (error || supabaseUser === null)
    throwNotFoundError(`Unable to invite ${email}`)

  // check if iuser exist, if does, just invite to host club
  // if doesn't, create user and also invite to team
})
