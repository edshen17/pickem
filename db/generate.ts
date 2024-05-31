/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import dayjs from 'dayjs'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename)

const migrationsFolder = path.join(__dirname, 'migrations')
const fileName = process.argv[2]

if (!fileName) {
  console.error('Please provide a filename for the migration.')
  process.exit(1)
}

const currentDate = dayjs().format('YYYY-MM-DD_HH-mm-ss')
const migrationFileName = `${currentDate}_${fileName}.ts`
const migrationFilePath = path.join(migrationsFolder, migrationFileName)

const migrationTemplate = `
import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {

}

export async function down(db: Kysely<any>): Promise<void> {

}
`

fs.writeFileSync(migrationFilePath, migrationTemplate, 'utf-8')
console.log(`Migration file created: ${migrationFilePath}`)
