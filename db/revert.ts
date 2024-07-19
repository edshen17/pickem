/* eslint-disable no-console */
import process from 'node:process'
import 'dotenv/config'
import { db, migrator } from '~/db/kysely'

async function revertLastMigration() {
  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success')
      console.info(`Migration "${it.migrationName}" was reverted successfully`)
    else if (it.status === 'Error')
      console.error(`Failed to revert migration "${it.migrationName}"`)
    else console.info('--- ~ results?.forEach ~ it.status:', it.status)
  })

  if (error) {
    console.error('Failed to revert migration')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

revertLastMigration()
