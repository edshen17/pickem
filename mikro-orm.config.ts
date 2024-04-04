import type { Options } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import config from './runtime'

const mikroOrmConfig: Options = {
  metadataProvider: TsMorphMetadataProvider,
  entitiesTs: ['./entities'],
  dbName: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  driver: PostgreSqlDriver,
}

export default mikroOrmConfig
