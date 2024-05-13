import { PrimaryKey } from '@mikro-orm/core'

export function UuidPrimaryKey() {
  return PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
}
