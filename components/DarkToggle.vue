<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button class="u-icon-btn" @click="toggleDark">
    <div i="carbon-moon dark:carbon-sun" class="u-text-2xl hover:u-text-teal-600" />
  </button>
</template>
