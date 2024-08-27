import { throwError, throwUnauthorizedError } from '~/server/utils/errors/common'
import type { IUser } from '~/view-models/user'

export function hasRoles(user: IUser, roles: string[]) {
  return roles.includes(user.role ?? throwError('Role required'))
}

export class AuthGuard {
  static availableFor(user: IUser | null, roles: string[]): asserts user is IUser {
    if (user && !hasRoles(user, roles) || !user)
      throwUnauthorizedError()
  }

  static requireUser(user: IUser | null): asserts user is IUser {
    if (!user)
      throwUnauthorizedError()
  }
}
