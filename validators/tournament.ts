import { z } from 'zod'

export const tournamentValidator = z.object({
  name: z.string().min(1, 'Please enter the tournament name'),
})

export type TournamentValidator = z.infer<typeof tournamentValidator>
