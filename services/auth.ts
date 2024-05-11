const { auth } = useSupabaseClient()

export async function handleSignup(email: string, password: string) {
  const { data, error } = await auth.signUp({ email, password })
  return { data, error }
}

export async function handleSignIn(email: string, password: string) {
  const { data, error } = await auth.signInWithPassword({ email, password })
  return { data, error }
}
