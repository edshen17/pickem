<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
})
</script>

<template>
  <div class="u-m-5 u-space-y-3">
    <p>Play</p>
    <p>Create pool</p>
    <p>
      <router-link to="/tournament-management" class="u-text-blue-600">
        Tournament management
      </router-link>
    </p>
    <p>
      <router-link to="/host-club-management" class="u-text-blue-600">
        Host Club management
      </router-link>
    </p>
  </div>
</template>
