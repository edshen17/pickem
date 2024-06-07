import type { User } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

function hasRoles(user: User, roleTypes: string[]) {
  return roleTypes.some(roleType => getEnumKey(DefaultRoleTypes, roleType) === user.roleTypeId)
}

function isOwner() {

}

export async function protectRoute(event: any, roles?: string[]) {
  // TODO: add roles
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  return user
}
