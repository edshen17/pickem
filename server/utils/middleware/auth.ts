import type { EventHandlerRequest, H3Event } from 'h3'
import type { User } from '@supabase/supabase-js'

import { createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { userRepository } from '~/repositories/user-repository'
import { throwUnauthorizedError } from '~/server/utils/errors/common'
import type { IUser } from '~/view-models/user'

interface IApiMethodRequest {
  event: H3Event<EventHandlerRequest>
  user: IUser | null
  supabaseUser: User | null
}

interface IAuthenticatedMethodRequest extends IApiMethodRequest {
  supabaseUser: User
}

type ApiMethod<T> = (props: IApiMethodRequest) => Promise<T>
type AuthenticatedApiMethod<T> = (props: IAuthenticatedMethodRequest) => Promise<T>

export function apiMiddleware<T>(apiMethod: ApiMethod<T>, requireAuthentication: boolean) {
  return async (event: H3Event) => {
    let supabaseUser: User | null = null
    let user: IUser | null = null

    try {
      if (requireAuthentication) {
        supabaseUser = await serverSupabaseUser(event)

        if (!supabaseUser)
          throwUnauthorizedError()

        user = await userRepository.findByIdWithHostClub(supabaseUser.id)
      }
      return await apiMethod({ event, user, supabaseUser })
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

export function authenticated<T>(apiMethod: AuthenticatedApiMethod<T>) {
  return eventHandler(apiMiddleware(apiMethod as ApiMethod<T>, true))
}

export function anonymous<T>(apiMethod: ApiMethod<T>) {
  return eventHandler(apiMiddleware(apiMethod, false))
}
