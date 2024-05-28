export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  const { requiresAuth, requiresRedirectOnAuth } = to.meta

  if ((!requiresAuth && !requiresRedirectOnAuth) || (requiresRedirectOnAuth && !user.value))
    return

  if (requiresAuth && !user.value)
    return navigateTo('/')

  if (requiresRedirectOnAuth && user.value)
    return navigateTo('/dashboard')
})
