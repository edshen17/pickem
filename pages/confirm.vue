<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

async function onLogin() {
  const response = await fetch('/api/users')
  if (response.ok) {
    useCookie(`${cookieName}-redirect-path`).value = null
    router.push(redirectPath || '/dashboard')
  }
}

watch(user, () => {
  if (user.value)
    onLogin()
  else
    router.push('/log-in')
}, { immediate: true })
</script>

<template>
  <div>
    <p class="u-text-black">
      Redirecting...
    </p>
  </div>
</template>
