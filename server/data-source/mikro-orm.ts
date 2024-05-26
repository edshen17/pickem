import { Migrator } from '@mikro-orm/migrations'
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { User } from '../../entities/User'
import config from '~/mikro-orm.config'

export const connection = MikroORM.init(config)
