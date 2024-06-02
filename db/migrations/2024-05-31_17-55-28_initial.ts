import type { Kysely } from 'kysely'
import { sql } from 'kysely'
import { baseSchema, schemaWithAudit, uuid } from '~/db/util'

export async function up(db: Kysely<any>): Promise<void> {
  await schemaWithAudit(db.schema
    .createTable('users')
    .addColumn('id', 'uuid', uuid)
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('permissions', 'jsonb', col => col.defaultTo('[]')))

  await baseSchema(db.schema
    .createTable('roles')
    .addColumn('id', 'uuid', uuid)
    .addColumn('name', sql`varchar(255) check (name in ('OWNER', 'ADMIN', 'MEMBER'))`))

  await db.insertInto('roles').values(['OWNER', 'ADMIN', 'MEMBER'].map((v) => { return { id: sql`gen_random_uuid()`, name: v } })).execute()

  await schemaWithAudit(db.schema
    .createTable('host_clubs')
    .addColumn('id', 'uuid', uuid)
    .addColumn('name', 'varchar', col => col.notNull()))

  await schemaWithAudit(db.schema
    .createTable('tournaments')
    .addColumn('id', 'uuid', uuid)
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('host_club_id', 'uuid', col => col.notNull().references('host_clubs.id')))

  await schemaWithAudit(db.schema
    .createTable('host_club_members')
    .addColumn('id', 'uuid', uuid)
    .addColumn('host_club_id', 'uuid', col => col.notNull().references('host_clubs.id'))
    .addColumn('user_id', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('role_id', 'uuid', col => col.notNull().references('roles.id'))
    .addUniqueConstraint('unique_host_club_user', ['host_club_id', 'user_id']))

  await db.schema
    .createIndex('idx_host_club_members_query')
    .on('host_club_members')
    .columns(['host_club_id', 'user_id'])
    .execute()

  await baseSchema(db.schema
    .createTable('audit_log')
    .addColumn('id', 'uuid', uuid)
    .addColumn('table_name', 'text')
    .addColumn('record_id', 'text')
    .addColumn('operation_type', sql`varchar(255) check (operation_type in ('INSERT', 'UPDATE', 'DELETE'))`)
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`))
    .addColumn('updated_by', 'text')
    .addColumn('original_values', 'jsonb')
    .addColumn('new_values', 'jsonb'),
  )

  await db.schema
    .createIndex('idx_audit_log_query')
    .on('audit_log')
    .columns(['table_name', 'record_id', 'updated_by'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('host_club_members').execute()
  await db.schema.dropTable('tournaments').execute()
  await db.schema.dropTable('host_clubs').execute()
  await db.schema.dropTable('roles').execute()
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('audit_log').execute()
}
