import process from 'node:process'
import { authenticated } from '~/server/utils/middleware/auth'
import type { ICTTFElo } from '~/view-models/elo'
import type { ICTTFTournament } from '~/view-models/tournament'

const headers = {
  Authorization: `Bearer ${process.env.ICTTF_TOKEN}`,
}

export async function getTournaments() {
  const tournaments = await $fetch<string>(`https://icttf.co/pickem-tournaments.php`, {
    headers,
  })
  return JSON.parse(tournaments) as ICTTFTournament[]
}

export async function getElos() {
  const elos = await $fetch<string>(`https://icttf.co/pickem-elo.php`, {
    headers,
  })
  return JSON.parse(elos) as ICTTFElo[]
}

export async function getTournamentById(id: string) {
  const tournaments = await getTournaments()
  const tournament = tournaments.find(t => t.id === id)
  return tournament ?? throwNotFoundError('Tournament not found')
}

export async function getEloByPlayerId(id: string) {
  const elos = await getElos()
  const elo = elos.find(e => e.id === id)
  return elo ?? throwNotFoundError('Tournament not found')
}

export default authenticated(async () => {
  // TODO: use { user } to get tournaments, get rid of json.parse?
  const tournaments = await getTournaments()
  return tournaments
})
