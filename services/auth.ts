export const accessTokenCookieKey = 'sb-access-token'

export async function handleSignup(email: string, password: string) {
  const { auth } = useSupabaseClient()
  const { data, error } = await auth.signUp({ email, password })
  return { data, error }
}

export async function handleSignIn(email: string, password: string) {
  const { auth } = useSupabaseClient()
  const { data, error } = await auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function handleSignOut() {
  const { auth } = useSupabaseClient()
  const accessTokenCookie = useCookie(accessTokenCookieKey)
  accessTokenCookie.value = null
  const { error } = await auth.signOut()
  if (error)
    throw error
}
