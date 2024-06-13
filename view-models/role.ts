export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  NATION = 'NATION',
  CLUB_DIRECTOR = 'CLUB_DIRECTOR',
  FAN = 'FAN',
}

export const adminRoles = [Role.OWNER, Role.ADMIN, Role.CLUB_DIRECTOR]
