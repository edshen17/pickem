import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('picks')
    .addColumn('name', 'varchar(50)')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('picks')
    .dropColumn('name')
    .execute()
}
