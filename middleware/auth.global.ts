export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const { requiresAuth, requiresRedirectOnAuth } = to.meta

  if ((!requiresAuth && !requiresRedirectOnAuth) || (requiresRedirectOnAuth && !user.value))
    return

  if (requiresAuth && !user.value)
    return navigateTo('/log-in')

  if (requiresRedirectOnAuth && user.value)
    return navigateTo('/dashboard')
})
