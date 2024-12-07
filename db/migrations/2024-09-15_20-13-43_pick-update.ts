import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('picks')
    .dropConstraint('unique_pool_user')
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('picks')
    .addUniqueConstraint('unique_pool_user', ['pool_id', 'user_id'])
    .execute()
}
