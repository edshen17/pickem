import process from 'node:process'
import type { Selectable } from 'kysely'
import type { Pools } from 'kysely-codegen'
import dayjs from 'dayjs'
import { type IPoolAllocation, type IPoolListView, type IPoolView, type IPrizeAllocation, PoolStatus } from '~/view-models/pool'
import { decrypt } from '~/utils/encrypt'
import { formatDate } from '~/utils/formatter/date'
import { getTournamentById } from '~/server/api/tournaments'

export function toPoolView({ id, currency, entry_fee, is_private, is_publicly_watchable, max_players, number_of_picks, password, pool_allocation, prize_allocation, tournament_id, event_id }: Selectable<Pools>): IPoolView {
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
  }
}

// TODO: maybe join pool with player entries?
export async function toPoolListView({ id, prize_allocation, tournament_id }: Selectable<Pools>): Promise<IPoolListView> {
  // TODO: get number of entries and donation amount
  const { title, venue, contact_name, start_date, end_date } = await getTournamentById(tournament_id)

  return {
    id,
    status: PoolStatus.SCHEDULED, // TODO: calculate based off start date??
    name: title,
    host: venue,
    admin: contact_name,
    numberOfWinners: Object.keys(prize_allocation as { [key: string]: number }).length,
    numberOfEntries: 0,
    donationAmount: 0,
    openDate: formatDate(dayjs(start_date).toDate()),
    closeDate: formatDate(dayjs(end_date).toDate()),
  }
}
