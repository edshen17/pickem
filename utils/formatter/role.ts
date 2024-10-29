import { Role } from '~/view-models/role'

export function formatRole(role: Role): string {
  switch (role) {
    case Role.OWNER:
      return 'Club Owner'
    case Role.ADMIN:
      return 'Admin'
    case Role.MEMBER:
      return 'Member'
    case Role.NATION:
      return 'Nation'
    case Role.CLUB_DIRECTOR:
      return 'Club Director'
    case Role.FAN:
      return 'Fan'
    default:
      return role
  }
}
