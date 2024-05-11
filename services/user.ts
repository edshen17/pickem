import type { UserSchema } from '~/schemas/user'
import { handleError } from '~/services/common'

export async function createUser(userData: UserSchema) {
  const { data: createdUser, error } = await useFetch<UserSchema>('/api/users', {
    method: 'POST',
    body: userData,
  })

  await handleError(error)

  return createdUser.value
}
