import { authenticated } from '~/server/utils/middleware/auth'
import type { ICTTFTournament } from '~/view-models/tournament'

export async function getTournamentById(id: string) {
  const tournament = await $fetch<string>(`https://icttf.co/pickem.php?tournament_id=${id}`)
  return JSON.parse(tournament) as ICTTFTournament
}

export default authenticated(async () => {
  // TODO: use { user } to get tournaments, get rid of json.parse?
  const tournament = await getTournamentById(`10`)
  return [tournament]
})
