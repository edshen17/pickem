import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('pools')
    .dropColumn('points_per_win')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('pools')
    .addColumn('points_per_win', 'integer', col => col.notNull().defaultTo(5))
    .execute()
}
