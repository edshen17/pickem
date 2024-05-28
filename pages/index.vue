<script setup lang="ts">
definePageMeta({
  requiresRedirectOnAuth: true,
})

const error = ref<Error | null>(null)

onErrorCaptured((e) => {
  error.value = e
})

function resetError() {
  error.value = null
}
</script>

<template>
  <div class="dark:u-dark-text">
    <main class="u-relative u-flex-grow">
      <PopupAlert v-show="error" @popup-close="resetError">
        {{ error?.message }}
      </PopupAlert>
      <RouterView />
    </main>
  </div>
</template>
