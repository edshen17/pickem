/* eslint-disable no-console */
import path from 'node:path'
import process from 'node:process'
import { promises as fs } from 'node:fs'
import { Pool } from 'pg'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'
import 'dotenv/config'

export const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DB_CONNECTION_URL ?? ``,
    }),
  }),
})

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
  }),
  allowUnorderedMigrations: true,
})

async function migrateToLatest() {
  await migrator.migrateDown()
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
