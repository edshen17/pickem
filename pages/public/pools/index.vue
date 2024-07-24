<script setup lang="ts">
const { data } = await useFetchApi('/api/pools').then((res) => {
  return res
})
</script>

<template>
  <PoolTable v-if="data" :rows="data ?? []" />
</template>
