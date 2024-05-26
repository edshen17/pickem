import process from 'node:process'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Migrator } from '@mikro-orm/migrations'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import 'dotenv/config'

export default {
  metadataProvider: TsMorphMetadataProvider,
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./entities/**/*.ts'],
  extensions: [Migrator],
  clientUrl: process.env.DB_CONNECTION_URL,
  driver: PostgreSqlDriver,
}
