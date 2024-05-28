import { z } from 'zod'

export const userValidator = z.object({
  email: z.string().min(1, 'Please enter an email').email('Please enter a valid email'),
  password: z.string().min(8, 'Please enter a password with at least 8 characters'),
})

// can update to use name:
// firstName: z.string().optional()
export const logInUserValidator = userValidator.extend({})

export function getUserValidator(isSignupPage: boolean) {
  return isSignupPage ? userValidator : logInUserValidator
}

export type UserValidator = z.infer<ReturnType<typeof getUserValidator>>
