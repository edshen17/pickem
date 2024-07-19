export interface IPoolAllocation {
  admin: number
  owner: number
}

export interface IPrizeAllocation { [key: string]: number }

// TODO: add name + description?
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
}
