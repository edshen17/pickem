import type { SelectQueryBuilder } from 'kysely'
import type { DB, Picks } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class PickRepository extends BaseRepository<Picks> {
  declare query: SelectQueryBuilder<DB, 'picks', Picks>

  constructor() {
    super('picks')
  }

  async findByPoolAndUser(poolId: string, userId: string) {
    return await this.query.where('pool_id', '=', poolId).where('user_id', '=', userId).selectAll().execute() ?? null
  }
}

export const pickRepository = new PickRepository()
