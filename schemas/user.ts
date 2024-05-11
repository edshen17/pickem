import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().min(1, 'Please enter an email').email('Please enter a valid email'),
  password: z.string().min(8, 'Please enter a password with at least 8 characters'),
})

// can update to use name:
// firstName: z.string().optional()
export const logInUserSchema = userSchema.extend({})

export function getUserSchema(isSignupPage: boolean) {
  return isSignupPage ? userSchema : logInUserSchema
}

export type UserSchema = z.infer<ReturnType<typeof getUserSchema>>
