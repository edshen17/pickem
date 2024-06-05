<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, () => {
  if (user.value) {
    useCookie(`${cookieName}-redirect-path`).value = null
    router.push(redirectPath || '/dashboard')
  }
  else { router.push('/log-in') }
}, { immediate: true })
</script>

<template>
  <div>
    <p class="u-text-black">
      Redirecting...
    </p>
  </div>
</template>
