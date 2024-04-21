import { PrimaryKey } from '@mikro-orm/core'

export function UuidPrimaryKey() {
  return PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
}
