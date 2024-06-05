export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const userStore = useUserStore()
  const isLoggedIn = Boolean(user.value)

  const { requiresAuth, requiresRedirectOnAuth } = to.meta

  if (isLoggedIn && !userStore.user)
    await userStore.getUser()

  if ((!requiresAuth && !requiresRedirectOnAuth) || (requiresRedirectOnAuth && !isLoggedIn))
    return

  if (requiresAuth && !isLoggedIn)
    return navigateTo('/log-in')

  if (requiresRedirectOnAuth && isLoggedIn)
    return navigateTo('/dashboard')
})
