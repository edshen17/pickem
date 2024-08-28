export interface ISupabaseToken {
  access_token: string
  refresh_token: string
}

export const accessTokenCookieKey = 'sb-access-token'

export async function handleSignUp(name: string, email: string, password: string, supabaseToken: ISupabaseToken) {
  const { auth } = useSupabaseClient()
  if (supabaseToken.access_token && supabaseToken.refresh_token) {
    await auth.setSession(supabaseToken)
    return await auth.updateUser({ password })
  }
  else {
    return await auth.signUp({ email, password, options: {
      data: { name },
    } })
  }
}

export async function handleSignIn(email: string, password: string) {
  const { auth } = useSupabaseClient()
  const { data, error } = await auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function handleSignOut() {
  const router = useRouter()
  const { auth } = useSupabaseClient()
  const userStore = useUserStore()
  userStore.resetUser()

  const accessTokenCookie = useCookie(accessTokenCookieKey)
  accessTokenCookie.value = null
  const { error } = await auth.signOut()
  router.push('/')
  if (error)
    throw error
}
