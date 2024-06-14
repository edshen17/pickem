import type { SelectQueryBuilder } from 'kysely'
import type { DB, HostClubMembers } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class HostClubMemberRepository extends BaseRepository<HostClubMembers> {
  declare query: SelectQueryBuilder<DB, 'host_club_members', any>

  constructor() {
    super('host_club_members')
  }

  async findByHostClubAndUser(hostClubId: string, userId: string) {
    return await this.query.where('host_club_id', '=', hostClubId).where('user_id', '=', userId).selectAll().execute()
  }
}

export const hostClubMemberRepository = new HostClubMemberRepository()
