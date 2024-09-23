import { type SelectQueryBuilder, type Selectable, sql } from 'kysely'
import type { DB, Pools } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class PoolRepository extends BaseRepository<Pools> {
  declare query: SelectQueryBuilder<DB, 'pools', Pools>

  constructor() {
    super('pools')
  }

  // TODO: add pagination or filter
  async getPoolsWithEntryCount() {
    const result = await this.db
      .selectFrom('pools')
      .leftJoin('picks', 'pools.id', 'picks.pool_id')
      .leftJoin('users', 'pools.created_by', 'users.id')
      .select([
        sql<Selectable<Pools>>`to_jsonb(pools.*)`.as('pool'),
      ])
      .select('users.name as director')
      .select(eb => [
        eb.fn.count('picks.id').as('number_of_entries'),
      ])
      .groupBy(['pools.id', 'users.name'])
      .execute()

    return result.map(row => ({
      ...row.pool,
      director: row.director,
      number_of_entries: Number(row.number_of_entries),
    }))
  }
}

export const poolRepository = new PoolRepository()
