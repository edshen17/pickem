import type { SelectQueryBuilder } from 'kysely'
import type { DB, HostClubMembers } from 'kysely-codegen'
import { BaseRepository, type IAuditUser } from '~/repositories/base-repository'

export class HostClubMemberRepository extends BaseRepository<HostClubMembers> {
  declare query: SelectQueryBuilder<DB, 'host_club_members', HostClubMembers>

  constructor() {
    super('host_club_members')
  }

  async findByHostClubAndUser(hostClubId: string, userId: string) {
    return await this.query.where('host_club_id', '=', hostClubId).where('user_id', '=', userId).selectAll().executeTakeFirstOrThrow()
  }

  async deleteByUserId(userId: string, hostClubId: string, user: IAuditUser) {
    const hostClubMember = await this.query.where('user_id', '=', userId)
      .where('host_club_id', '=', hostClubId).selectAll().executeTakeFirstOrThrow()
    await this.updateById(hostClubMember.id, { deleted_at: new Date() }, user)
  }
}

export const hostClubMemberRepository = new HostClubMemberRepository()
