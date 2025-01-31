import process from 'node:process'
import type { Selectable } from 'kysely'
import type { Picks, Pools } from 'kysely-codegen'
import dayjs from 'dayjs'
import { decrypt } from '~/utils/encrypt'
import { getEloByPlayerId, getTournamentById } from '~/server/api/tournaments'
import type { IPoolAllocation, IPoolListView, IPoolView, IPoolWithTournamentAndPicks, IPrizeAllocation } from '~/view-models/pool'
import { PoolStatus, ResultStatus } from '~/view-models/pool'
import type { ICTTFPlayer } from '~/view-models/player'
import type { EventType, ICTTFEvent } from '~/view-models/event'
import { pickRepository } from '~/repositories/pick-repository'
import type { IUser } from '~/view-models/user'

export type Pool = Selectable<Pools & { number_of_entries: number, pool_manager: string | null }>

export function toPoolView({ id, currency, entry_fee, is_private, is_publicly_watchable, max_players, number_of_picks, password, pool_allocation, prize_allocation, tournament_id, event_id, entry_start_date, name, number_of_entries }: Pool): IPoolView {
  return {
    id,
    currency,
    entryFee: Number(entry_fee),
    isPrivateLeague: is_private,
    isPubliclyWatchable: is_publicly_watchable,
    maxNumberOfPlayers: Number(max_players),
    numberOfPicks: Number(number_of_picks),
    password: is_private
      ? decrypt(password ?? throwError('Password required'), process.env.CRYPTO_SECRET_KEY
      ?? throwError('Secret key required'))
      : null,
    poolAllocation: pool_allocation as unknown as IPoolAllocation,
    prizeAllocation: prize_allocation as unknown as IPrizeAllocation,
    tournamentId: tournament_id,
    eventId: event_id,
    entryStartDate: entry_start_date,
    name,
    numberOfEntries: number_of_entries,
  }
}

function assignRandomWins(players: ICTTFPlayer[]): Record<string, number> {
  const totalPlayers = players.length
  let remainingWins = totalPlayers
  const wins: Record<string, number> = {}

  players.forEach(player => wins[player.id] = 0)

  while (remainingWins > 0) {
    const randomIndex = Math.floor(Math.random() * players.length)
    wins[players[randomIndex].id]++
    remainingWins--
  }

  return wins
}

// TODO: check if results are in or not, from separate API?
async function getResults(event: ICTTFEvent) {
  return assignRandomWins(event.players)
}

async function getPoolStatus({ start_date, end_date }: ICTTFEvent, entryStartDate: Date): Promise<PoolStatus> {
  const startDate = dayjs(entryStartDate)
  const currentDate = dayjs()
  const tournamentStartDate = dayjs(start_date)
  const tournamentEndDate = dayjs(end_date)

  if (currentDate.isBefore(startDate)) {
    return PoolStatus.SCHEDULED
  }

  if (currentDate.isAfter(startDate) && currentDate.isBefore(tournamentStartDate)) {
    return PoolStatus.STARTED
  }

  if (currentDate.isAfter(tournamentStartDate) && currentDate.isBefore(tournamentEndDate)) {
    return PoolStatus.LIVE
  }

  return PoolStatus.FINISHED
}

async function getResultStatus(event: ICTTFEvent): Promise<ResultStatus> {
  // TODO: results based on time, or some other status to know exact result status
  const results = await getResults(event)
  return results ? ResultStatus.FINALIZED : ResultStatus.NOT_AVAILABLE
}

// TODO: maybe join pool with player entries?
export async function toPoolListView({ id, prize_allocation, tournament_id, event_id, number_of_entries, entry_start_date, name, pool_manager }: Pool): Promise<IPoolListView> {
  const tournament = await getTournamentById(tournament_id)
  const { title, contact_name } = tournament
  const selectedEvent = tournament.events.find(e => e.id === event_id) ?? throwError('Event not found')

  const resultStatus = await getResultStatus(selectedEvent)

  return {
    id,
    status: await getPoolStatus(selectedEvent, entry_start_date),
    resultStatus,
    name: name ?? `${title} - ${selectedEvent.title}`,
    event: selectedEvent.title,
    owner: contact_name,
    tournament: title,
    poolManager: pool_manager ?? ``,
    numberOfWinners: Object.keys(prize_allocation as { [key: string]: number }).length,
    numberOfEntries: number_of_entries,
    donationAmount: 0, // TODO: fill out
    openDate: entry_start_date,
    closeDate: dayjs(selectedEvent.start_date).toDate(),
  }
}

async function getRating({ id }: ICTTFPlayer, eventType: EventType) {
  const { elo_hardbat, elo_sandpaper, elo_wood } = await getEloByPlayerId(id)
  switch (eventType) {
    case 'H':
      return elo_hardbat
    case 'S':
      return elo_sandpaper
    case 'W':
      return elo_wood
    default:
      return null
  }
}

export function toPickView({ id, name, player_ids, created_at, updated_at }: Selectable<Picks>) {
  return {
    id,
    playerIds: player_ids as string[],
    createdAt: created_at,
    updatedAt: updated_at,
    name: name ?? ``,
  }
}

export async function toPoolWithTournamentAndPicksView({ id, name, tournament_id, event_id, currency, entry_fee, number_of_picks, prize_allocation }: Pool, user: IUser | null): Promise<IPoolWithTournamentAndPicks> {
  const picks = user ? await pickRepository.findAllByPoolAndUser(id, user.id) : null
  const tournament = await getTournamentById(tournament_id)
  const selectedEvent = tournament.events.find(e => e.id === event_id) ?? throwError('Event not found')
  const players = await Promise.all(selectedEvent.players.map(async (p) => {
    return { ...p, rating: await getRating(p, selectedEvent.type) }
  }))
  const results = await getResults(selectedEvent)

  return { id, name, currency, entryFee: Number(entry_fee), numberOfPicks: Number(number_of_picks), prizeAllocation: prize_allocation as unknown as IPrizeAllocation, tournament, event: { ...selectedEvent, players }, picks: picks?.map(toPickView) ?? [], results }
}
