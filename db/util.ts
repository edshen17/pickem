import { type CreateTableBuilder, sql } from 'kysely'
import type { DB } from 'kysely-codegen'

export function baseSchema(v: CreateTableBuilder<keyof DB, never>) {
  return v.execute()
}

export function schemaWithAudit(v: CreateTableBuilder<keyof DB, never>) {
  return v.addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('created_by', 'uuid', col => col.notNull())
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_by', 'uuid', col => col.notNull())
    .addColumn('deleted_at', 'timestamp')
    .execute()
}
