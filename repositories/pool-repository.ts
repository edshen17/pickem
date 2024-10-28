import { type SelectQueryBuilder, type Selectable, sql } from 'kysely'
import type { DB, Pools } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class PoolRepository extends BaseRepository<Pools> {
  declare query: SelectQueryBuilder<DB, 'pools', Pools>

  constructor() {
    super('pools')
  }

  private getBasePoolQuery() {
    return this.db
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
  }

  private formatPoolResult({ pool, director, number_of_entries }: { pool: Selectable<Pools>, director: string | null, number_of_entries: string | number | bigint }) {
    return {
      ...pool,
      director,
      number_of_entries: Number(number_of_entries),
    }
  }

  // TODO: add pagination or filter
  async getPoolsWithEntryCount() {
    const result = await this.getBasePoolQuery().execute()
    return result.map(this.formatPoolResult)
  }

  async findByIdWithEntryCount(poolId: string) {
    const result = await this.getBasePoolQuery()
      .where('pools.id', '=', poolId)
      .executeTakeFirst()

    if (!result)
      return null
    return this.formatPoolResult(result)
  }
}

export const poolRepository = new PoolRepository()
