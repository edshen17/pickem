// can contain multiple admins
// owned by user aka "host club"
// contains multiple pools

// do tournaments have start dates? are they different than pool start dates?

import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { UuidPrimaryKey } from '../services/entity.ts'
import { FullAuditEntity, User } from '../entities/User.ts'

@Entity()
export class Tournament extends FullAuditEntity {
  @UuidPrimaryKey()
  id!: string

  @Property()
  name!: string

  @ManyToOne(() => User)
  host!: User
}
