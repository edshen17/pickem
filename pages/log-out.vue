<script setup lang="ts">
import { handleSignOut } from '~/services/auth'

onMounted(async () => {
  await handleSignOut()
})
</script>
