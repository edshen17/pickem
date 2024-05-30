// can contain multiple admins
// owned by user aka "host club"
// contains multiple pools

// do tournaments have start dates? are they different than pool start dates?

import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { users } from './users'
import { fullAudit } from './audits'

// add pool relationship
export const tournaments = pgTable('tournaments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  hostId: uuid('host_id').notNull(),
  ...fullAudit,
})

export const tournamentRelations = relations(tournaments, ({ one }) => ({
  host: one(users, {
    fields: [tournaments.hostId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [tournaments.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [tournaments.updatedBy],
    references: [users.id],
  }),
}))

export type Tournament = typeof users.$inferSelect
export type NewTournament = typeof users.$inferInsert
