<script setup lang="ts">
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
    <Navbar />
    <main class="u-flex-grow u-relative">
      <PopupAlert v-show="error" @popup-close="resetError">
        {{ error?.message }}
      </PopupAlert>
      <RouterView />
    </main>
  </div>
</template>
