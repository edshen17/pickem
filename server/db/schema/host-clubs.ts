import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const hostClubs = pgTable('host-clubs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
})

export type HostClub = typeof hostClubs.$inferSelect
export type NewHostClub = typeof hostClubs.$inferInsert
