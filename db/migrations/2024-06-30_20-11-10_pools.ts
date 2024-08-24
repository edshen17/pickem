import type { Kysely } from 'kysely'
import { sql } from 'kysely'

import { baseSchema, schemaWithAudit } from '~/db/util'

export async function up(db: Kysely<any>): Promise<void> {
  await schemaWithAudit(db.schema
    .createTable('pools')
    .addColumn('tournament_id', 'varchar(30)', col => col.notNull())
    .addColumn('event_id', 'varchar(30)', col => col.notNull())
    .addColumn('is_private', 'boolean', col => col.notNull())
    .addColumn('password', 'varchar(20)')
    .addColumn('is_publicly_watchable', 'boolean', col => col.notNull())
    .addColumn('max_players', 'numeric', col => col.notNull())
    .addColumn('number_of_picks', 'numeric', col => col.notNull())
    .addColumn('entry_fee', 'bigint', col => col.notNull())
    .addColumn('currency', 'varchar(5)', col => col.notNull())
    .addColumn('payment_system', 'varchar(30)')
    .addColumn('prize_allocation', 'jsonb')
    .addColumn('pool_allocation', 'jsonb'),
  )

  await baseSchema(db.schema
    .createTable('pool_allocations')
    .addColumn('name', 'varchar(50)')
    .addColumn('percentage', 'decimal(5, 2)', col => col.notNull()))

  await db.insertInto('pool_allocations')
    .values([
      { name: 'PLAYER', percentage: 75.00 },
      { name: 'WRTT', percentage: 5.00 },
      { name: 'MAINTAINER', percentage: 2.50 },
      { name: 'ICTTF', percentage: 2.50 },
      { name: 'NATION', percentage: 2.50 },
      { name: 'ADMIN', percentage: 7.50 },
      { name: 'OWNER', percentage: 5.00 },
    ])
    .execute()

  await sql`ALTER TABLE pools ENABLE ROW LEVEL SECURITY;`.execute(db)
  await sql`ALTER TABLE pool_allocations ENABLE ROW LEVEL SECURITY;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('pools').execute()
  await db.schema.dropTable('pool_allocations').execute()
}
