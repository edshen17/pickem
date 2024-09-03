import { authenticated } from '~/server/utils/middleware/auth'
import type { ICTTFTournament } from '~/view-models/tournament'

export async function getTournaments() {
  // TODO: remove hard-coded 10
  const tournaments = await $fetch<string>(`https://icttf.co/pickem.php?tournament_id=10`)
  return JSON.parse(tournaments) as ICTTFTournament[]
}

export async function getTournamentById(id: string) {
  const tournaments = await getTournaments()
  const tournament = tournaments.find(t => t.id === id)
  return tournament ?? throwNotFoundError('Tournament not found')
}

export default authenticated(async () => {
  // TODO: use { user } to get tournaments, get rid of json.parse?
  const tournaments = await getTournaments()
  return tournaments
})
