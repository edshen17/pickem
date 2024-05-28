<script setup lang="ts">
definePageMeta({
  requiresRedirectOnAuth: true,
})
</script>

<template>
  <UserAuthForm :is-signup-page="false" />
</template>
