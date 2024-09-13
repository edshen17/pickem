import type { ICTTFPlayer } from '~/view-models/player'

export enum EventType {
  HARD_BAT = 'H',
  SAND_PAPER = 'S',
  WOOD = 'W',
}

export interface ICTTFEvent {
  id: string
  title: string
  short_name: string
  start_date: string
  end_date: string // TODO: remove?
  type: EventType
  format: string
  max_players: string
  best_of: string
  players_advancing_se_de: string
  players_advancing_lo: string
  num_groups: string
  players: ICTTFPlayer[]
}
