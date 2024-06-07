import { serverSupabaseClient } from '#supabase/server'
import { protectRoute } from '~/server/utils/protect-route'

export default defineEventHandler(async (event) => {
  // TODO: check user permissions (host clubs)
  const user = await protectRoute(event)
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
    .eq('host_club_members.user_id', user.id)

  if (error)
    throw error

  return { statusCode: 200, message: 'Success', data }
})
