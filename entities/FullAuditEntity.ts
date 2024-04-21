import { BeforeUpdate, DateTimeType, ManyToOne, Property } from '@mikro-orm/core'
import { User } from '@/entities/User'

export abstract class FullAuditEntity {
  @Property({ type: 'uuid' })
  updatedBy!: string

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()

  @Property({ type: DateTimeType, nullable: true })
  deletedAt!: Date | null

  @ManyToOne(() => User)
  updatedByUser!: User

  @Property()
  createdAt = new Date()

  @Property({ type: 'uuid' })
  createdBy!: string

  @ManyToOne(() => User)
  createdByUser!: User

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date()
  }
}
