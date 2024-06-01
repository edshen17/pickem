/* eslint-disable no-console */
import process from 'node:process'
import 'dotenv/config'
import { db, migrator } from '~/db/kysely'

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
