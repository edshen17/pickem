import { type SelectQueryBuilder, type Selectable, sql } from 'kysely'
import type { DB, Pools } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'
import type { Pool } from '~/server/api/pools/conversion'

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
      .select('users.name as pool_manager')
      .select(eb => [
        eb.fn.count('picks.id').as('number_of_entries'),
      ])
      .groupBy(['pools.id', 'users.name'])
  }

  private formatPoolResult({ pool, pool_manager, number_of_entries }: { pool: Selectable<Pools>, pool_manager: string | null, number_of_entries: string | number | bigint }) {
    return {
      ...pool,
      pool_manager,
      number_of_entries: Number(number_of_entries),
    }
  }

  // TODO: add pagination or filter
  async getPoolsWithEntryCount() {
    const result = await this.getBasePoolQuery().execute()
    return result.map(this.formatPoolResult)
  }

  async findById(poolId: string): Promise<Pool> {
    const result = await this.getBasePoolQuery()
      .where('pools.id', '=', poolId)
      .executeTakeFirst()

    return this.formatPoolResult(result ?? throwError('Pool not found'))
  }
}

export const poolRepository = new PoolRepository()
