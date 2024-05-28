import { timestamp, uuid } from 'drizzle-orm/pg-core'

export const fullAudit = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: uuid('created_by').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: uuid('updated_by').notNull(),
  deletedAt: timestamp('deleted_at'),
}
