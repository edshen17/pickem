import type { DB, HostClubMembers } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class HostClubMemberRepository extends BaseRepository<HostClubMembers> {
  protected tableName = 'host_club_members' as keyof DB
}

export const hostClubMemberRepository = new HostClubMemberRepository()
