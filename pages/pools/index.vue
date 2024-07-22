<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
})

const { data } = await useFetchApi('/api/pools').then((res) => {
  return res
})
</script>

<template>
  <PoolTable v-if="data" />
</template>
