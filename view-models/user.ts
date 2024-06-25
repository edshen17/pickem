import type { Selectable } from 'kysely'
import type { HostClubs, Users } from 'kysely-codegen'
import type { Role } from './role'

export interface IUser extends Selectable<Users> {
  role?: string | null
  host_club?: Selectable<HostClubs> | null
}

export interface ITeamMember {
  deletedAt: Date | null
  id: string
  name: string
  email: string
  role: Role
}
