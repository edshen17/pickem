import { StatusCodes } from 'http-status-codes'

export function throwError(value: string | Error): never {
  const error = typeof value === `string` ? new Error(value) : value
  throw error
}

function throwApiError(statusCode: StatusCodes, message: string): never {
  throw createError({ statusCode, message })
}

export function throwForbiddenError(message?: string): never {
  throw throwApiError(StatusCodes.FORBIDDEN, message ?? 'Forbidden')
}

export function throwUnauthorizedError(message?: string): never {
  throw throwApiError(StatusCodes.UNAUTHORIZED, message ?? 'Unauthorized')
}

export function throwNotFoundError(message?: string): never {
  throw throwApiError(StatusCodes.NOT_FOUND, message ?? 'Not found')
}
