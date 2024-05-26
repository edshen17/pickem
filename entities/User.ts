import { BeforeUpdate, DateTimeType, Entity, ManyToOne, Property, type Rel } from '@mikro-orm/core'
import { UuidPrimaryKey } from '~/services/entity'

export abstract class FullAuditEntity {
  @Property({ type: 'uuid' })
  updatedBy!: string

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null

  @ManyToOne(() => User)
  updatedByUser!: Rel<User>

  @Property()
  createdAt = new Date()

  @Property({ type: 'uuid' })
  createdBy!: string

  @ManyToOne(() => User)
  createdByUser!: Rel<User>

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date()
  }
}

@Entity()
export class User extends FullAuditEntity {
  @UuidPrimaryKey()
  id!: string

  @Property()
  name!: string
}
