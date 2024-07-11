import { z } from 'zod'

export const poolValidator = z.object({
  isPrivateLeague: z.boolean().default(false),
  password: z.string().min(5, 'Please enter a password with at least 5 characters').default(''),
  isPubliclyWatchable: z.boolean().default(true),
  maxNumberOfPlayers: z.coerce.number().int().positive().default(1000),
  numberOfPicks: z.coerce.number().int().positive().nullable().default(null),
  entryFee: z.coerce.number().nonnegative().default(20),
  currency: z.string().default('USD'),
  numberOfWinners: z.coerce.number().int().positive().default(3),
  prizeAllocation: z.object({}).catchall(z.coerce.number().positive()).refine(
    data => Object.values(data).reduce((sum, value) => sum + value, 0) === 100,
    { message: 'Prize allocation must sum up to 100%' },
  ).default({} as { [key: number]: number }),
  poolAllocation: z.object({
    // NOTE: if changing, make sure to update corresponding quasar input validation as it is separate
    // we don't use the following on the front-end
    owner: z.coerce.number().nonnegative().max(5, 'Must be less than or equal to 5%'),
    admin: z.coerce.number().nonnegative().max(7.5, 'Must be less than or equal to 7.5%'),
  }).default({
    owner: 0,
    admin: 0,
  }),
})

export type PoolValidator = z.infer<typeof poolValidator>
