import type { ICTTFPlayer } from '~/view-models/player'

export interface ICTTFEvent {
  id: string
  title: string
  short_name: string
  sched1_start_time: string
  sched1_end_time: string
  sched2_start_time: string
  sched2_end_time: string
  sched3_start_time: string
  sched3_end_time: string
  type: string
  format: string
  max_players: string
  best_of: string
  players_advancing_se_de: string
  players_advancing_lo: string
  num_groups: string
  players: ICTTFPlayer[]
}
