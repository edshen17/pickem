export interface IPoolAllocation {
  admin: number
  owner: number
}

export interface IPrizeAllocation { [key: string]: number }

export interface IPoolView {
  currency: string
  entryFee: number
  isPrivateLeague: boolean
  isPubliclyWatchable: boolean
  maxNumberOfPlayers: number
  numberOfPicks: number
  password: string | null
  poolAllocation: IPoolAllocation
  prizeAllocation: IPrizeAllocation
  name: string
  description: string
}

export interface IPoolListView {
  status: string
  name: string
  host: string
  admin: string
  numberOfEntries: number
  donationAmount: number
  numberOfWinners: number
  openDate: string
  closeDate: string
}
