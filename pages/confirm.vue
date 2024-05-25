<script setup lang="ts">
const user = useSupabaseUser()
const router = useRouter()

async function createUser() {
  try {
    const response = await fetch('/api/users')
    const data = await response.json()

    if (response.ok)
      // router.push('/dashboard')
      console.log('success')
    else
      throw new Error(data.message)
  }
  catch (error) {
    console.error('Error creating user:', error)
    // Handle the error, display a message to the user, or take appropriate action
  }
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
