export function formatRole(role: string): string {
  switch (role) {
    case 'OWNER':
      return 'Owner'
    case 'ADMIN':
      return 'Admin'
    case 'MEMBER':
      return 'Member'
    case 'NATION':
      return 'Nation'
    case 'CLUB_DIRECTOR':
      return 'Club Director'
    case 'FAN':
      return 'Fan'
    default:
      return role
  }
}
