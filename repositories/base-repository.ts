import type { Insertable, ReferenceExpression, Updateable } from 'kysely'
import type { DB } from 'kysely-codegen'
import { db } from '~/db/kysely'

export interface IAuditUser {
  id: string
}

type FullAuditFields = 'updated_by' | 'created_by' | 'updated_at' | 'created_at'

export function fullAudit(v: Record<string, any>, user: IAuditUser | null) {
  return { updated_by: user?.id, created_by: user?.id, updated_at: new Date(), created_at: new Date(), ...v }
}

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

  async updateById(id: string, update: Omit<Updateable<T>, FullAuditFields>, user: IAuditUser | null) {
    return await db
      .updateTable(this.tableName)
      .set(fullAudit(update, user))
      .where('id', '=', id)
      .execute()
  }

  async insert(entity: Omit<Insertable<T>, FullAuditFields>, user: IAuditUser | null) {
    return await db
      .insertInto(this.tableName)
      .values(fullAudit(entity, user))
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  // TODO: set deleted_at
  async deleteById(id: string) {
    return await db
      .deleteFrom(this.tableName)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()
  }
}
