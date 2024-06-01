import type { Kysely } from 'kysely'
import { sql } from 'kysely'
import { baseSchema, schemaWithAudit } from '~/db/util'

export async function up(db: Kysely<any>): Promise<void> {
  await schemaWithAudit(db.schema
    .createTable('users')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', col => col.notNull()))

  await schemaWithAudit(db.schema
    .createTable('tournaments')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('host_id', 'uuid', col => col.notNull().references('users.id')))

  await baseSchema(db.schema
    .createTable('roles')
    .addColumn('role_id', 'serial', col => col.primaryKey())
    .addColumn('role', 'varchar', col => col.notNull()))

  await schemaWithAudit(db.schema
    .createTable('host-clubs')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', col => col.notNull()))

  await schemaWithAudit(db.schema
    .createTable('host-club-members')
    .addColumn('host_club_id', 'uuid', col => col.notNull().references('host-clubs.id'))
    .addColumn('user_id', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('role_id', 'integer', col => col.notNull().references('roles.role_id'))
    .addPrimaryKeyConstraint('primary-key', ['host_club_id', 'user_id']))

  await baseSchema(db.schema
    .createTable('audit_log')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('table_name', 'text')
    .addColumn('record_id', 'text')
    .addColumn('operation_type', 'text')
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`))
    .addColumn('updated_by', 'text')
    .addColumn('original_values', 'jsonb')
    .addColumn('new_values', 'jsonb'))
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('host-club-members').execute()
  await db.schema.dropTable('tournaments').execute()
  await db.schema.dropTable('host-clubs').execute()
  await db.schema.dropTable('roles').execute()
  await db.schema.dropTable('users').execute()
}
