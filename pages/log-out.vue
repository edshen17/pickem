<script setup lang="ts">
const { auth } = useSupabaseClient()

onMounted(async () => {
  const { error } = await auth.signOut()
  if (error)
    throw error
})
</script>
