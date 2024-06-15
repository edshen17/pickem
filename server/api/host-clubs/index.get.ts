import { sql } from 'kysely'
import { authenticated } from '~/server/utils/middleware/auth'
import { AuthGuard } from '~/server/utils/auth-guards'
import { adminRoles } from '~/view-models/role'
import { db } from '~/db/kysely'
import type { ITeamMember } from '~/view-models/user'

export default authenticated(async ({ user }) => {
  // TODO: check user permissions (host clubs)
  AuthGuard.availableFor(user, adminRoles)

  const data = await db
    .selectFrom('host_clubs')
    .leftJoin('host_club_members', 'host_club_members.host_club_id', 'host_clubs.id')
    .leftJoin('users', 'host_club_members.user_id', 'users.id')
    .leftJoin('roles', 'host_club_members.role_id', 'roles.id')
    .select([
      'host_clubs.id',
      'host_clubs.name',
      'host_clubs.created_at',
      'host_clubs.created_by',
      'host_clubs.updated_at',
      'host_clubs.updated_by',
      'host_clubs.deleted_at',
      sql<ITeamMember[]>`json_agg(
      json_build_object(
        'id', users.id,
        'name', users.name,
        'email', users.email,
        'role', roles.name
      )
    )`.as('host_club_members'),
    ])
    .groupBy([
      'host_clubs.id',
      'host_clubs.name',
      'host_clubs.created_at',
      'host_clubs.created_by',
      'host_clubs.updated_at',
      'host_clubs.updated_by',
      'host_clubs.deleted_at',
    ])
    .execute()

  return data
})
