import process from 'node:process'
import type { Selectable } from 'kysely'
import type { Pools } from 'kysely-codegen'
import type { IPoolAllocation, IPoolView, IPrizeAllocation } from '~/view-models/pool'
import { decrypt } from '~/utils/encrypt'

export function toPoolView({ currency, entry_fee, is_private, is_publicly_watchable, max_players, number_of_picks, password, pool_allocation, prize_allocation, name }: Selectable<Pools>): IPoolView {
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
    name, // TODO: fill name + description?
  }
}
