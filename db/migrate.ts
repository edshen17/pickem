/* eslint-disable no-console */
import process from 'node:process'
import pg from 'pg'
import { Kysely, Migrator, PostgresDialect } from 'kysely'
import 'dotenv/config'
import { ESMFileMigrationProvider } from '~/db/provider'

const { Pool } = pg

export const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL ?? ``,
    }),
  }),
})

export const migrator = new Migrator({
  db,
  provider: new ESMFileMigrationProvider('./migrations'),
  allowUnorderedMigrations: true,
})

async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success')
      console.log(`Migration "${it.migrationName}" was executed successfully`)
    else if (it.status === 'Error')
      console.error(`Failed to execute migration "${it.migrationName}"`)
    else console.log('--- ~ results?.forEach ~ it.status:', it.status)
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
