import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { auth } = await serverSupabaseClient(event)

  const { data: { user: supabaseUser } } = await auth.getUser(event.context.user)

  if (!supabaseUser)
    throw createError({ statusCode: 401, message: 'Unauthorized' })

  // const { em } = await getDb()
  // const orm = await MikroORM.init(mikroOrmConfig)
  // const users = await orm.em.find(User)

  // const existingUser = await em.findOne(User, { id: supabaseUser.id })

  // if (!existingUser) {
  //   const newUser = new User()
  //   newUser.id = supabaseUser.id
  //   newUser.name = supabaseUser.user_metadata.full_name ?? supabaseUser.email?.split('@')[0]
  //   newUser.createdBy = supabaseUser.id
  //   newUser.updatedBy = supabaseUser.id
  //   await em.persistAndFlush(newUser)
  // }

  return { statusCode: 200, message: 'Success' }
})
