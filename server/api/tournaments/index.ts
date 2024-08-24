import { authenticated } from '~/server/utils/middleware/auth'
import type { ICTTFTournament } from '~/view-models/tournament'

export default authenticated(async () => {
  // TODO: use { user } to get tournaments, get rid of json.parse?
  const tournament = await $fetch<string>('https://icttf.co/pickem.php?tournament_id=10')
  return [JSON.parse(tournament)] as ICTTFTournament[]
})
