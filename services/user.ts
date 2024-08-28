import type { UserValidator } from '~/validators/user'
import { handleError } from '~/services/common'

export async function createUser(userData: UserValidator) {
  const { data: createdUser, error } = await useFetch<UserValidator>('/api/users', {
    method: 'POST',
    body: userData,
  })

  await handleError(error)

  return createdUser.value
}
