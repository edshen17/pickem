import type { Insertable, ReferenceExpression, Updateable } from 'kysely'
import type { DB } from 'kysely-codegen'
import { db } from '~/db/kysely'

export abstract class BaseRepository<T> {
  protected abstract tableName: keyof DB

  async findById(id: string) {
    return await db
      .selectFrom(this.tableName)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()
  }

  async find(criteria: Partial<T>) {
    let query = db.selectFrom(this.tableName)

    for (const [key, value] of Object.entries(criteria)) {
      if (value !== undefined)
        query = query.where(key as ReferenceExpression<DB, keyof DB>, value === null ? 'is' : '=', value)
    }

    return await query.selectAll().execute()
  }

  async updateById(id: string, updateWith: Updateable<T>) {
    return await db
      .updateTable(this.tableName)
      .set(updateWith)
      .where('id', '=', id)
      .execute()
  }

  async insert(entity: Insertable<T>) {
    return await db
      .insertInto(this.tableName)
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async deleteById(id: string) {
    return await db
      .deleteFrom(this.tableName)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
  }
}
