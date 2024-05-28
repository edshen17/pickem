<script setup lang="ts">
import { handleSignOut } from '~/services/auth'

definePageMeta({
  requiresAuth: true,
})

onMounted(async () => {
  await handleSignOut()
})
</script>
