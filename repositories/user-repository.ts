import { type Selectable, sql } from 'kysely'
import type { DB, HostClubs, Users } from 'kysely-codegen'
import { db } from '~/db/kysely'
import { BaseRepository } from '~/repositories/base-repository'

export class UserRepository extends BaseRepository<Users> {
  protected tableName = 'users' as keyof DB

  async findByIdWithRoles(userId: string) {
    const result = await db.selectFrom('users')
      .where('users.id', '=', userId)
      .leftJoin('host_clubs', 'host_clubs.id', 'users.selected_host_club_id')
      .leftJoin('host_club_members', 'host_club_members.user_id', 'users.id')
      .leftJoin('roles', 'roles.id', 'host_club_members.role_id')
      .select([
        sql<Users>`to_jsonb(users.*)`.as('users'),
        sql<HostClubs | null>`CASE WHEN users.selected_host_club_id IS NULL THEN NULL ELSE to_jsonb(host_clubs.*) END`.as(
          'host_club',
        ),
        sql<string | null>`
          CASE
            WHEN users.selected_host_club_id IS NULL THEN NULL
            ELSE roles.name
          END
        `.as('role'),
      ])
      .executeTakeFirst()

    if (!result)
      return null

    // create auth view and don't pass
    return {
      ...result.users,
      role: result.role,
      host_club: result.host_club,
    }
  }
}

export const userRepository = new UserRepository()
