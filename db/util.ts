import type { ColumnDefinitionBuilder, CreateTableBuilder } from 'kysely'
import { sql } from 'kysely'

import type { DB } from 'kysely-codegen'

export function uuid(col: ColumnDefinitionBuilder) {
  return col.primaryKey().defaultTo(sql`gen_random_uuid()`)
}

export function baseSchema(v: CreateTableBuilder<keyof DB, never>) {
  return v.addColumn('id', 'uuid', uuid).execute()
}

export function schemaWithAudit(v: CreateTableBuilder<keyof DB, never>) {
  return v.addColumn('id', 'uuid', uuid)
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('created_by', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_by', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('deleted_at', 'timestamp')
    .execute()
}
