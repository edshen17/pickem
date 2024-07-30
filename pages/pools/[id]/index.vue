<script setup lang="ts">
import type { IPoolView } from '~/view-models/pool'

definePageMeta({
  requiresAuth: true,
})

const route = useRouter().currentRoute.value

// TODO: type
const id = (route.params as any).id

const loading = ref(true)

const { data } = await useFetchApi<IPoolView>(`/api/pools/${id}`).then((res) => {
  return res
}).finally(() => {
  loading.value = false
})
</script>

<template>
  <Pool v-if="data" :pool="data" :loading="loading" />
</template>
