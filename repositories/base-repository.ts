import type { Generated, Insertable, ReferenceExpression, SelectQueryBuilder, Selectable, Updateable } from 'kysely'

import type { DB } from 'kysely-codegen'
import { db } from '~/db/kysely'

export interface IAuditUser {
  id: string
}

type FullAuditFields = 'updated_by' | 'created_by' | 'updated_at' | 'created_at'

export function fullAudit(v: Record<string, any>, user: IAuditUser) {
  return { updated_by: user.id, created_by: user.id, updated_at: new Date(), created_at: new Date(), ...v }
}

export class BaseRepository<T extends { id: Generated<string> }> {
  public db = db
  protected tableName: keyof DB
  protected query: SelectQueryBuilder<DB, keyof DB, any>

  constructor(tableName: keyof DB) {
    this.tableName = tableName
    this.query = db.selectFrom(this.tableName)
  }

  async findById(id: string) {
    return await this.query
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst() as Selectable<T> | undefined
  }

  async find(criteria: Partial<T>): Promise<Selectable<T>[]> {
    for (const [key, value] of Object.entries(criteria)) {
      if (value !== undefined)
        this.query = this.query.where(key as ReferenceExpression<DB, keyof DB>, value === null ? 'is' : '=', value)
    }

    return await this.query.selectAll().execute() as Selectable<T>[]
  }

  async updateById(id: string, update: Omit<Updateable<T>, FullAuditFields>, user: IAuditUser) {
    const originalEntity = await db
      .selectFrom(this.tableName)
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst()

    const updatedEntity = await db
      .updateTable(this.tableName)
      .set(fullAudit(update, user))
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()

    await db
      .insertInto('audit_log')
      .values({
        table_name: this.tableName,
        record_id: id,
        operation_type: 'UPDATE',
        updated_by: user?.id,
        original_values: JSON.stringify(originalEntity),
        new_values: JSON.stringify(updatedEntity),
      })
      .execute()

    return updatedEntity as T
  }

  async insert(entity: Omit<Insertable<T>, FullAuditFields>, user: IAuditUser) {
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
        updated_by: user?.id,
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
      .executeTakeFirstOrThrow()
  }
}
