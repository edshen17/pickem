import type { ICTTFEvent } from '~/view-models/event'

export interface ICTTFTournament {
  id: string
  director_id: string
  title: string
  venue: string
  contact_name: string
  contact_phone: string
  contact_email: string
  table_count: string
  website: string
  description: string
  visible: string
  online_payment: string
  events: ICTTFEvent[]
}
