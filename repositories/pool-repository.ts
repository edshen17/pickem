import type { SelectQueryBuilder } from 'kysely'
import type { DB, Pools } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class PoolRepository extends BaseRepository<Pools> {
  declare query: SelectQueryBuilder<DB, 'pools', Pools>

  constructor() {
    super('pools')
  }
}

export const poolRepository = new PoolRepository()
