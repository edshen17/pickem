<script setup lang="ts">
import type { IPoolView } from '~/view-models/pool'

definePageMeta({
  requiresAuth: true,
})

const { id } = useRoute('pools-id').params

console.log(useRoute(), 'here')

const loadingPool = ref(true)

const { data } = await useFetchApi<IPoolView>(`/api/pools/${id}`).then((res) => {
  loadingPool.value = false
  return res
})
</script>

<template>
  <Pool v-if="data" :pool="data" />
</template>
