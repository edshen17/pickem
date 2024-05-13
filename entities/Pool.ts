import { Entity, ManyToOne, OneToMany, OneToOne, Property } from '@mikro-orm/core'
import { UuidPrimaryKey } from '../services/entity.ts'

export enum PoolStatus {
  SCHEDULED = 'Scheduled',
  STARTED = 'Started',
  LIVE = 'Live',
  FINISHED = 'Finished',
}

@Entity()
export class Pool {
  @UuidPrimaryKey()
  id!: string

  @Property()
  name!: string

  @Property()
  startDate!: Date

  @Property()
  stopDate!: Date

  @Property()
  entryFee!: number

  @ManyToOne(() => Member)
  admin!: Member

  @OneToOne(() => Tournament)
  tournament!: Tournament

  @OneToMany(() => Player, player => player.pool)
  players!: Player[]

  @OneToMany(() => Choice, choice => choice.pool)
  choices!: Choice[]
}

// todo: distinguish diff between tournament and event?
@Entity()
export class Tournament {
  @UuidPrimaryKey()
  id!: string

  @Property()
  startDate!: Date

  @Property()
  stopDate!: Date
}

@Entity()
export class Member {
  @UuidPrimaryKey()
  id!: string

  @Property()
  name!: string

  @Property()
  email!: string

  @Property()
  isApproved!: boolean

  @OneToMany(() => Pool, pool => pool.admin)
  adminPools!: Pool[]
}

@Entity()
export class Player {
  @UuidPrimaryKey()
  id!: string

  @ManyToOne(() => Member)
  member!: Member

  @ManyToOne(() => Pool)
  pool!: Pool

  @Property()
  isPaid!: boolean

  @OneToMany(() => Pick, pick => pick.player)
  picks!: Pick[]
}

@Entity()
export class Choice {
  @UuidPrimaryKey()
  id!: string

  @Property()
  name!: string

  @ManyToOne(() => Pool)
  pool!: Pool
}

@Entity()
export class Pick {
  @UuidPrimaryKey()
  id!: string

  @ManyToOne(() => Player)
  player!: Player

  @ManyToOne(() => Choice)
  choice!: Choice
}
