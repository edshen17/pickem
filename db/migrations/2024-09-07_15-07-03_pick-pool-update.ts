import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`DROP POLICY IF EXISTS picks_single_per_pool_policy ON picks;`.execute(db)

  await db.schema
    .alterTable('pools')
    .addColumn('entry_start_date', 'timestamp', col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('points_per_win', 'integer', col => col.notNull().defaultTo(5))
    .addColumn('name', 'varchar(100)')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`CREATE POLICY picks_single_per_pool_policy ON picks
    FOR INSERT
    WITH CHECK (
      NOT EXISTS (
        SELECT 1 FROM picks
        WHERE pool_id = picks.pool_id AND user_id = auth.uid()
      )
    );`.execute(db)

  await db.schema
    .alterTable('pools')
    .dropColumn('entry_start_date')
    .dropColumn('points_per_win')
    .dropColumn('name')
    .execute()
}
