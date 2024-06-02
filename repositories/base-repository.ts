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

export abstract class BaseRepository<T extends { id: string }> {
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
    const originalEntity = await db
      .selectFrom(this.tableName)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()

    const updatedEntity = await db
      .updateTable(this.tableName)
      .set(fullAudit(update, user))
      .where('id', '=', id)
      .execute()

    await db
      .insertInto('audit_log')
      .values({
        table_name: this.tableName,
        record_id: id,
        operation_type: 'UPDATE',
        updated_by: user?.id || null,
        original_values: JSON.stringify(originalEntity),
        new_values: JSON.stringify(updatedEntity),
      })
      .execute()

    return updatedEntity
  }

  async insert(entity: Omit<Insertable<T>, FullAuditFields>, user: IAuditUser | null) {
    const insertedEntity = await db
      .insertInto(this.tableName)
      .values(fullAudit(entity, user))
      .returningAll()
      .executeTakeFirstOrThrow() as T

    if (!insertedEntity.id)
      throw new Error('Inserted entity missing ID')

    await db
      .insertInto('audit_log')
      .values({
        table_name: this.tableName,
        record_id: insertedEntity.id?.toString(),
        operation_type: 'INSERT',
        updated_by: user?.id || null,
        original_values: null,
        new_values: JSON.stringify(entity),
      })
      .execute()

    return insertedEntity
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
