import { type Kysely, sql } from 'kysely'
import { schemaWithAudit } from '~/db/util'

export async function up(db: Kysely<any>): Promise<void> {
  await schemaWithAudit(db.schema
    .createTable('picks')
    .addColumn('pool_id', 'uuid', col => col.notNull().references('pools.id'))
    .addColumn('user_id', 'uuid', col => col.notNull().references('users.id'))
    .addColumn('player_ids', 'jsonb', col => col.notNull())
    .addUniqueConstraint('unique_pool_user', ['pool_id', 'user_id']))

  await db.schema
    .createIndex('idx_picks_query')
    .on('picks')
    .columns(['pool_id', 'user_id'])
    .execute()

  await sql`ALTER TABLE picks ENABLE ROW LEVEL SECURITY;`.execute(db)

  await sql`CREATE POLICY picks_user_policy ON picks
    USING (user_id = auth.uid());`.execute(db)

  await sql`CREATE POLICY picks_single_per_pool_policy ON picks
    FOR INSERT
    WITH CHECK (
      NOT EXISTS (
        SELECT 1 FROM picks
        WHERE pool_id = picks.pool_id AND user_id = auth.uid()
      )
    );`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_picks_query').execute()
  await db.schema.dropTable('picks').execute()
}
