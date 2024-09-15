import { z } from 'zod'
import { formatDate } from '~/utils/formatter/date'
import type { IPrizeAllocation } from '~/view-models/pool'

export const poolValidator = z.object({
  auth: z.object({
    isPrivateLeague: z.boolean(),
    password: z.string().optional(),
  }).refine(({ isPrivateLeague, password }) => {
    if (isPrivateLeague)
      return password && password.length >= 5 && password.length <= 20

    return true
  }, {
    message: 'Password must be between 5 and 20 characters',
    path: ['password'],
  }).default({ isPrivateLeague: false, password: '' }),
  name: z.string().nullable(),
  pointsPerWin: z.coerce.number().int().positive().default(5),
  isPubliclyWatchable: z.boolean().default(true),
  maxNumberOfPlayers: z.coerce.number().int().positive().max(1000).default(1000),
  numberOfPicks: z.coerce.number().int().positive().max(100).default(5),
  entryFee: z.coerce.number().nonnegative().default(0),
  entryStartDate: z.string().min(1, 'Please input a date').default(() => formatDate(new Date(), 'YYYY/MM/DD')),
  currency: z.string().min(3).max(3).default('USD'),
  numberOfWinners: z.coerce.number().int().positive().max(100).default(3),
  prizeAllocation: z.object({}).catchall(z.coerce.number().positive().optional()).refine(
    data => Object.values(data).reduce((sum, value) => sum! + value!, 0) === 100,
    { message: 'Prize allocation must sum up to 100%' },
  ).default({ 1: 50, 2: 30, 3: 20 } as IPrizeAllocation),
  poolAllocation: z.object({
    owner: z.coerce.number().nonnegative().max(5, 'Must be less than or equal to 5%'),
    admin: z.coerce.number().nonnegative().max(7.5, 'Must be less than or equal to 7.5%'),
  }).default({
    owner: 0,
    admin: 0,
  }),
  tournamentId: z.string().max(100),
  eventId: z.string().max(100),
})

export type PoolValidator = z.infer<typeof poolValidator>
