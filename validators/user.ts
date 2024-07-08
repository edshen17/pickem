import { z } from 'zod'

export const emailValidator = z.string().min(1, 'Please enter an email').email('Please enter a valid email')

export const userValidator = z.object({
  name: z.string().min(1, 'Please enter a name').max(1000),
  email: emailValidator,
  password: z.string().min(8, 'Please enter a password with at least 8 characters'),
})

export const inviteUserValidator = z.object({
  email: emailValidator,
  roleId: z.string().uuid(),
})

export const logInUserValidator = userValidator.extend({
  name: z.string().optional(),
})

export function getUserValidator(isSignupPage: boolean) {
  return isSignupPage ? userValidator : logInUserValidator
}

export type UserValidator = z.infer<ReturnType<typeof getUserValidator>>
