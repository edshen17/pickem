<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

async function createUser() {
  const response = await fetch('/api/users')
  if (response.ok)
    router.push('/dashboard')
}

watch(user, () => {
  if (user.value)
    createUser()
}, { immediate: true })
</script>

<template>
  <div>
    <p class="u-text-black">
      Redirecting...
    </p>
  </div>
</template>
