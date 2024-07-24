import process from 'node:process'
import type { Selectable } from 'kysely'
import type { Pools } from 'kysely-codegen'
import dayjs from 'dayjs'
import type { IPoolAllocation, IPoolListView, IPoolView, IPrizeAllocation } from '~/view-models/pool'
import { decrypt } from '~/utils/encrypt'
import { formatDate } from '~/utils/formatter/date'

export function toPoolView({ currency, entry_fee, is_private, is_publicly_watchable, max_players, number_of_picks, password, pool_allocation, prize_allocation, name, description }: Selectable<Pools>): IPoolView {
  return {
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
    name,
    description,
  }
}

export function toPoolListView({ pool_allocation }: Selectable<Pools>): IPoolListView {
  // TODO: fill these out from AMIBO API, maybe remove name field from pools?
  return {
    status: 'scheduled',
    name: 'test name',
    host: 'test host',
    admin: 'test admin',
    numberOfWinners: Object.keys(pool_allocation as { [key: string]: number }).length,
    numberOfEntries: 0,
    donationAmount: 0,
    openDate: formatDate(dayjs().toDate()),
    closeDate: formatDate(dayjs().add(1, 'week').toDate()),
  }
}
