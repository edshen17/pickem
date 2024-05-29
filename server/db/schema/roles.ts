import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const roles = pgTable('roles', {
  id: serial('role_id').primaryKey(),
  role: varchar('role', { length: 255 }).notNull(),
})

export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
