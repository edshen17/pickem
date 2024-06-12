import { serverSupabaseClient } from '#supabase/server'
import { authenticated } from '~/server/utils/middleware/auth'
import { AuthGuard } from '~/server/utils/auth-guards'
import { Role } from '~/view-models/role'

export default authenticated(async ({ event, supabaseUser, user }) => {
  // TODO: check user permissions (host clubs)
  AuthGuard.availableFor(user, [Role.OWNER, Role.CLUB_DIRECTOR, Role.ADMIN])

  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('host_clubs')
    .select(`
        *,
        host_club_members (
          ...users(id, name, email),
          ...roles(role:name)
        )
      `)
    .eq('host_club_members.user_id', supabaseUser.id)

  if (error)
    throw error

  return data
})
