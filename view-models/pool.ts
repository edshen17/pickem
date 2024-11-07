import type { ICTTFEvent } from '~/view-models/event'
import type { ICTTFPlayer } from '~/view-models/player'
import type { ICTTFTournament } from '~/view-models/tournament'

export interface IPoolView {
  id: string
  name: string | null
  currency: string
  entryFee: number
  isPrivateLeague: boolean
  isPubliclyWatchable: boolean
  maxNumberOfPlayers: number
  numberOfPicks: number
  password: string | null
  poolAllocation: IPoolAllocation
  prizeAllocation: IPrizeAllocation
  tournamentId: string
  eventId: string
  entryStartDate: Date
  numberOfEntries: number
}

export interface IPoolWithTournamentAndPicks {
  id: string
  name: string | null
  currency: string
  entryFee: number
  numberOfPicks: number
  prizeAllocation: IPrizeAllocation
  tournament: ICTTFTournament
  event: IPoolEvent
  picks: IPickView[]
}

export interface IPickView {
  id: string
  name: string
  playerIds: string[]
  updatedAt: Date
  createdAt: Date
}

export interface IPoolEvent extends Omit<ICTTFEvent, 'players'> {
  players: IPoolPlayer[]
}

export interface IPoolPlayer extends Omit<ICTTFPlayer, 'elo_hardbat' | 'elo_sandpaper' | 'elo_wood'> {
  rating: string | null
}

export interface IPoolAllocation {
  poolManager: number
}

export interface IPrizeAllocation { [key: string]: number }

export interface ITournamentView {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
}

export interface IEventView {
  id: string
}

export enum PoolStatus {
  SCHEDULED = 'SCHEDULED',
  STARTED = 'STARTED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
}

export interface IPoolListView {
  id: string
  status: PoolStatus
  tournament: string
  event: string
  owner: string
  name: string
  poolManager: string
  numberOfEntries: number
  donationAmount: number
  numberOfWinners: number
  openDate: Date
  closeDate: Date
}
