import { Entity, Property } from '@mikro-orm/core'
import { FullAuditEntity } from '~/entities/FullAuditEntity'
import { UuidPrimaryKey } from '~/entities/common'

@Entity()
export class User extends FullAuditEntity {
  @UuidPrimaryKey()
  id!: string

  @Property()
  firstName!: string

  @Property()
  lastName!: string

  @Property()
  email!: string
}
