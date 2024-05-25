import { MikroORM } from '@mikro-orm/postgresql'
import config from '~/mikro-orm.config'

export async function getDb() {
  return await MikroORM.init(config)
}
