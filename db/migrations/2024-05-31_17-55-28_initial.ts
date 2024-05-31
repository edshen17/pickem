import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('created_by', 'uuid', col => col.notNull())
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('deleted_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('tournaments')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('host_id', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('created_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('created_by', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('updated_at', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_by', 'uuid', col => col.references('users.id'))
    .addColumn('deleted_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('roles')
    .addColumn('role_id', 'serial', col => col.primaryKey())
    .addColumn('role', 'varchar', col => col.notNull())
    .execute()

  await db.schema
    .createTable('host-clubs')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', col => col.notNull())
    .execute()

  await db.schema
    .createTable('host-club-members')
    .addColumn('host_club_id', 'uuid', col => col.notNull().references('host-clubs.id'))
    .addColumn('user_id', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('role_id', 'integer', col => col.notNull().references('roles.role_id'))
    .addPrimaryKeyConstraint('primary-key', ['host_club_id', 'user_id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('host-club-members').execute()
  await db.schema.dropTable('host-clubs').execute()
  await db.schema.dropTable('roles').execute()
  await db.schema.dropTable('tournaments').execute()
  await db.schema.dropTable('users').execute()
}
