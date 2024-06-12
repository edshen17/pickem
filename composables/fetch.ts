// composables/useCustomFetch.ts
import type { UseFetchOptions } from 'nuxt/app'

export function useFetchApi<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
  return useFetch(url, {
    ...options,
    onResponseError({ response }) {
      if (response.status) {
        // Handle specific error status codes
        switch (response.status) {
          case 401: // Unauthorized
            navigateTo('/unauthorized')
            break
          case 403: // Forbidden
            navigateTo('/forbidden')
            break
          case 500: // Internal Server Error
            navigateTo('/500')
            break
          // Add more cases for other status codes as needed
          default:
            // Handle other error status codes or fallback to a generic error page
            navigateTo('/error')
        }
      }
    },
  })
}
