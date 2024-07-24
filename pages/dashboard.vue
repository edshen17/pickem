<script setup lang="ts">
import { isAdmin } from '~/view-models/role'

definePageMeta({
  requiresAuth: true,
})
const { user: piniaUser } = storeToRefs(useUserStore())
</script>

<template>
  <div class="u-m-5 u-space-y-3">
    <p>
      <router-link to="/public/pools" class="u-text-blue-600">
        Play
      </router-link>
    </p>
    <div v-if="isAdmin(piniaUser?.role)">
      <p>
        <router-link to="/pools" class="u-text-blue-600">
          Pool management
        </router-link>
      </p>
      <p>
        <router-link to="/host-club-management" class="u-text-blue-600">
          Host Club management
        </router-link>
      </p>
    </div>
  </div>
</template>
