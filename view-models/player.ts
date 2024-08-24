// TODO: remove and upate with b
export interface IPlayerView {
  id: string
  firstName: string
  lastName: string
  rank: number
  rating: number
  [key: string]: string | number
}

export interface ICTTFPlayer {
  rank: number
  id: string
  name: string
  email: string | null
  elo_hardbat: string | null
  elo_sandpaper: string | null
  elo_wood: string | null
}
