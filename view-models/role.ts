export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  NATION = 'NATION',
  CLUB_DIRECTOR = 'CLUB_DIRECTOR',
  FAN = 'FAN',
}

export const adminRoles = [Role.OWNER, Role.ADMIN, Role.CLUB_DIRECTOR]

export function isAdmin(role: any) {
  return adminRoles.includes(role)
}

export function isOwner(role: any) {
  return role === Role.OWNER
}
