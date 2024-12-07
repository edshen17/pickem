/* eslint-disable node/prefer-global/process */
import pg from 'pg'
import { Kysely, Migrator, PostgresDialect } from 'kysely'
import type { DB } from 'kysely-codegen'

import 'dotenv/config'
import { ESMFileMigrationProvider } from '~/db/provider'

const { Pool } = pg

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL ?? import.meta.env.DATABASE_URL ?? ``,
    }),
  }),
})

export const migrator = new Migrator({
  db,
  provider: new ESMFileMigrationProvider('./migrations'),
  allowUnorderedMigrations: true,
})
