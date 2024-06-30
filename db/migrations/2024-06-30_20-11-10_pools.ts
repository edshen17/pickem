import type { Kysely } from 'kysely'
import { sql } from 'kysely'

import { schemaWithAudit } from '~/db/util'

export async function up(db: Kysely<any>): Promise<void> {
  await schemaWithAudit(db.schema
    .createTable('pools')
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('is_private', 'boolean')
    .addColumn('password', 'text')
    .addColumn('is_publicly_watchable', 'boolean')
    .addColumn('max_players', 'numeric')
    .addColumn('number_of_picks', 'numeric'),
  )

  await sql`ALTER TABLE pools ENABLE ROW LEVEL SECURITY;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('pools').execute()
}
