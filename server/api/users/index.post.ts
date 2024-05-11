import { userSchema } from '~/schemas/user'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log(body)

  // try {
  //   const validatedData = userSchema.parse(body)
  //   const createdUser = await createUserInDatabase(validatedData)
  //   return createdUser
  // }
  // catch (error) {
  //   throw createError({
  //     statusCode: 400,
  //     statusMessage: 'Invalid user data',
  //   })
  // }
})
