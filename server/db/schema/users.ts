import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { fullAudit } from './audits'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  ...fullAudit,
})

export const usersRelations = relations(users, ({ many }) => ({
  createdByUser: many(users),
  updatedByUser: many(users),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
