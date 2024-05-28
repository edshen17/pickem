import { eq } from 'drizzle-orm'
import { serverSupabaseClient } from '#supabase/server'
import { db } from '~/server/db/data-source'
import type { NewUser } from '~/server/db/schema/users'
import { users } from '~/server/db/schema/users'

export default defineEventHandler(async (event) => {
  const { auth } = await serverSupabaseClient(event)

  const { data: { user: supabaseUser } } = await auth.getUser(event.context.user)

  if (!supabaseUser)
    throw createError({ statusCode: 401, message: 'Unauthorized' })

  const [existingUser] = await db.select().from(users).where(eq(users.id, supabaseUser.id)).limit(1).execute()

  if (!existingUser) {
    const newUser: NewUser = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name ?? supabaseUser.email?.split('@')[0],
      createdBy: supabaseUser.id,
      updatedBy: supabaseUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert(users).values(newUser).execute()
  }

  return { statusCode: 200, message: 'Success' }
})
