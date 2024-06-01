import type { DB, Users } from 'kysely-codegen'
import { BaseRepository } from '~/repositories/base-repository'

export class UserRepository extends BaseRepository<Users> {
  protected tableName = 'users' as keyof DB
}

export const userRepository = new UserRepository()
