import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { hostClubs } from './host-clubs'
import { users } from './users'
import { roles } from './roles'

export const hostClubMembers = pgTable(
  'host-club-members',
  {
    hostClubId: uuid('host_club_id').notNull().references(() => hostClubs.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
  },
  table => ({
    pk: primaryKey({ columns: [table.hostClubId, table.userId] }),
  }),
)

export const membersRelations = relations(hostClubMembers, ({ one }) => ({
  hostClub: one(hostClubs, {
    fields: [hostClubMembers.hostClubId],
    references: [hostClubs.id],
  }),
  user: one(users, {
    fields: [hostClubMembers.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [hostClubMembers.roleId],
    references: [roles.id],
  }),
}))
