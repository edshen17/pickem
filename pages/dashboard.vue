<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const user = useSupabaseUser()
</script>

<template>
  <div>
    {{ user }}
  </div>
</template>
