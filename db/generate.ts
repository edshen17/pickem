/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import dayjs from 'dayjs'

const migrationsFolder = path.join(__dirname, 'migrations')
const fileName = process.argv[2]

if (!fileName) {
  console.error('Please provide a filename for the migration.')
  process.exit(1)
}

const currentDate = dayjs().toISOString()
const migrationFileName = `${currentDate}_${fileName}.ts`
const migrationFilePath = path.join(migrationsFolder, migrationFileName)

const migrationTemplate = `
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {

}

export async function down(db: Kysely<any>): Promise<void> {
  
}
`

fs.writeFileSync(migrationFilePath, migrationTemplate, 'utf-8')
console.log(`Migration file created: ${migrationFilePath}`)
