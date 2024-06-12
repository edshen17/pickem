import type { Selectable } from 'kysely'
import type { HostClubs, Users } from 'kysely-codegen'

export interface IUser extends Selectable<Users> {
  role?: string | null
  host_club?: Selectable<HostClubs> | null
}
