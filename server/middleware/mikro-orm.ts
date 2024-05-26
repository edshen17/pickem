import { connection } from '~/server/data-source/mikro-orm'

export default defineEventHandler(async (event) => {
  const orm = await connection
  event.context.em = orm.em.fork({ useContext: true }) // Fork
  event.context.orm = orm
})
