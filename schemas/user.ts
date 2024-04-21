import { z } from 'zod'

const userSchema = z.object({
  email: z.string().min(1, 'Please enter an email').email('Please enter a valid email'),
  firstName: z.string().min(1, 'Please enter your first name'),
  lastName: z.string().min(1, 'Please enter your last name'),
  password: z.string().min(8, 'Please enter a password with at least 8 characters'),
})

const logInUserSchema = userSchema.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export function getUserSchema(isSignupPage: boolean) {
  return isSignupPage ? userSchema : logInUserSchema
}

export type UserSchema = z.infer<ReturnType<typeof getUserSchema>>
