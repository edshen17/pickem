import { StatusCodes } from 'http-status-codes'

export function throwError(value: string | Error): never {
  const error = typeof value === `string` ? new Error(value) : value
  throw error
}

function throwApiError(statusCode: StatusCodes, message: string): never {
  throw createError({ statusCode, message })
}

export function throwForbiddenError(): never {
  throw throwApiError(StatusCodes.FORBIDDEN, 'Forbidden')
}

export function throwUnauthorizedError(): never {
  throw throwApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
}
