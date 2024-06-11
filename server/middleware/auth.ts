import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

import { createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { userRepository } from '~/repositories/user-repository'
import { throwUnauthorizedError } from '~/server/utils/errors/common'
import type { IUser } from '~/view-models/user-view'

export interface AuthenticatedEvent extends EventHandlerRequest {
  context: {
    supabaseUser: User | null
    user: IUser | null
  }
}

export function apiMiddleware(handler: EventHandler<AuthenticatedEvent, Promise<User | null>>, requireAuthentication: boolean) {
  return async (event: H3Event) => {
    const user: User | null = null

    try {
      if (requireAuthentication) {
        const supabaseUser = await serverSupabaseUser(event)

        if (!supabaseUser)
          throwUnauthorizedError()

        const user = await userRepository.findByIdWithHostClub(supabaseUser.id)
        event.context.supabaseUser = supabaseUser
        event.context.user = user
      }
      return await handler(event, user)
    }
    catch (e: any) {
      console.error(e)

      if (e.statusCode) {
        throw createError({
          statusCode: e.statusCode,
          statusMessage: e.statusMessage,
          message: e.message,
          ...e,
        })
      }

      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Something went wrong. Please try again.',
      })
    }
  }
}

export function authenticated(apiMethod: any) {
  return apiMiddleware(apiMethod, true)
}

export function anonymous(apiMethod: any) {
  return apiMiddleware(apiMethod, false)
}
