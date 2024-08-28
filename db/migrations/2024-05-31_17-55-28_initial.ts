import type { Kysely } from 'kysely'
import { sql } from 'kysely'
import { baseSchema, schemaWithAudit } from '~/db/util'

export async function up(db: Kysely<any>): Promise<void> {
  await schemaWithAudit(db.schema
    .createTable('users')
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('email', 'text', col => col.notNull())
    .addColumn('permissions', 'jsonb', col => col.defaultTo('[]')))

  await baseSchema(db.schema
    .createTable('roles')
    .addColumn('name', sql`text check (name in ('OWNER', 'ADMIN', 'MEMBER', 'NATION', 'CLUB_DIRECTOR', 'FAN'))`))

  await db.insertInto('roles').values(['OWNER', 'ADMIN', 'MEMBER', 'NATION', 'CLUB_DIRECTOR', 'FAN'].map(v => ({ id: sql`gen_random_uuid()`, name: v }))).execute()

  await schemaWithAudit(db.schema
    .createTable('host_clubs')
    .addColumn('name', 'text', col => col.notNull()))

  await schemaWithAudit(db.schema
    .createTable('host_club_members')
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
    .addColumn('table_name', 'text')
    .addColumn('record_id', 'uuid')
    .addColumn('operation_type', sql`text check (operation_type in ('INSERT', 'UPDATE', 'DELETE'))`)
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`now()`))
    .addColumn('updated_by', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('original_values', 'jsonb')
    .addColumn('new_values', 'jsonb'),
  )

  await db.schema
    .createIndex('idx_audit_log_query')
    .on('audit_log')
    .columns(['table_name', 'record_id', 'updated_by'])
    .execute()

  await sql`ALTER TABLE users ENABLE ROW LEVEL SECURITY;`.execute(db)
  await sql`CREATE POLICY users_policy ON users
  USING (
    id = auth.uid()
  );`.execute(db)

  await sql`ALTER TABLE roles ENABLE ROW LEVEL SECURITY;`.execute(db)
  await sql`CREATE POLICY roles_policy ON roles
  as PERMISSIVE
  for SELECT
  to public
  USING (
    true
  ); 
  `.execute(db)

  await sql`ALTER TABLE host_clubs ENABLE ROW LEVEL SECURITY;`.execute(db)
  await sql`CREATE POLICY host_clubs_members_policy ON host_clubs
  USING (
    id IN (
      SELECT host_club_id FROM host_club_members
      WHERE user_id = auth.uid()
    )
  );`.execute(db)
  await sql`ALTER TABLE host_club_members ENABLE ROW LEVEL SECURITY;`.execute(db)
  await sql`CREATE POLICY host_club_members_policy ON host_club_members
  USING (
    user_id = auth.uid()
  );`.execute(db)

  await sql`ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_audit_log_query').execute()
  await db.schema.dropIndex('idx_host_club_members_query').execute()

  await db.schema.dropTable('audit_log').execute()
  await db.schema.dropTable('host_club_members').cascade().execute()
  await db.schema.dropTable('host_clubs').cascade().execute()
  await db.schema.dropTable('roles').execute()
  await db.schema.dropTable('users').execute()
}
