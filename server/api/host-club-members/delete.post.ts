import { z } from 'zod'
import { AuthGuard } from '~/server/utils/auth-guards'
import { authenticated } from '~/server/utils/middleware/auth'
import { adminRoles } from '~/view-models/role'
import { hostClubMemberRepository } from '~/repositories/host-club-member-repository'

const validator = z.object({
  userId: z.string().uuid(),
})

export default authenticated(async ({ user, event }) => {
  AuthGuard.availableFor(user, adminRoles)

  // TODO: add more permission checks (who can delete who)
  const { userId } = await readValidatedBody(event, body => validator.parse(body))

  await hostClubMemberRepository.toggleDeleteByUserId(userId, user?.host_club?.id ?? throwError('Host club id required'), user ?? throwError('User required'))
})
