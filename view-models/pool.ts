export interface IPoolView {
  id: string
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
}

export interface IPoolAllocation {
  admin: number
  owner: number
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
  name: string
  host: string
  admin: string
  numberOfEntries: number
  donationAmount: number
  numberOfWinners: number
  openDate: string
  closeDate: string
}
