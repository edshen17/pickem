import { authenticated } from '~/server/utils/middleware/auth'
import { AuthGuard } from '~/server/utils/auth-guards'
import { adminRoles } from '~/view-models/role'
import { poolRepository } from '~/repositories/pool-repository'
import { toPoolView } from '~/server/api/pools/conversion'

export default authenticated(async ({ user, event }) => {
  // TODO: check user permissions (host clubs)
  AuthGuard.availableFor(user, adminRoles)

  const id = event.context.params?.id ?? throwError('Id required')

  const pool = await poolRepository.findById(id)

  return toPoolView(pool ?? throwNotFoundError('Pool not found'))
})
