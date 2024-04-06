import type { Options } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { config } from '~/runtime'

export const mikroOrmConfig: Options = {
  metadataProvider: TsMorphMetadataProvider,
  entities: ['./dist/entities'],
  entitiesTs: ['./entities'],
  dbName: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  driver: PostgreSqlDriver,
}
