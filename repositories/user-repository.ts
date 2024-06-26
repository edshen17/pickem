import { type SelectQueryBuilder, type Selectable, sql } from 'kysely'
import type { DB, HostClubs, Users } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'
import type { IUser } from '~/view-models/user'

export class UserRepository extends BaseRepository<Users> {
  declare query: SelectQueryBuilder<DB, 'users', Users>

  constructor() {
    super('users')
  }

  async findByIdWithHostClub(userId: string, hostClubId?: string): Promise<IUser | null> {
    const result = await this.query
      .where('users.id', '=', userId)
      .leftJoin('host_club_members', 'host_club_members.user_id', 'users.id')
      .leftJoin('host_clubs', 'host_clubs.id', 'host_club_members.host_club_id')
      .leftJoin('roles', 'roles.id', 'host_club_members.role_id')
      .select([
        sql<Selectable<Users>>`to_jsonb(users.*)`.as('user'),
        sql<{
          host_club: Selectable<HostClubs> | null
          role: string | null
        }[]>`jsonb_agg(jsonb_build_object(
        'host_club', to_jsonb(host_clubs.*),
        'role', roles.name
      ))`.as('host_clubs_with_roles'),
      ])
      .where('host_club_members.deleted_at', 'is', null)
      .groupBy('users.id')
      .executeTakeFirst()

    if (!result)
      return null

    const { user, host_clubs_with_roles } = result

    const selectedClub
    = host_clubs_with_roles.find(hc => hc.host_club?.id === hostClubId ?? user.selected_host_club_id)
    || host_clubs_with_roles[0]
    || null

    // TODO: create auth view and don't pass
    return {
      ...user,
      role: selectedClub?.role ?? null,
      host_club: selectedClub?.host_club ?? null,
    }
  }
}

export const userRepository = new UserRepository()
