import 'dotenv/config'
import process from 'node:process'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const client = postgres(process.env.DB_CONNECTION_URL ?? ``, { prepare: false })
export const db = drizzle(client)
