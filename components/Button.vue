<!-- Button.vue -->
<script setup>
defineProps({
  onClick: {
    type: Function,
    default: () => {},
  },
})
</script>

<template>
  <button
    class="u-rounded u-bg-blue-500 u-px-4 u-py-2 u-text-white u-transition u-duration-200 hover:u-bg-blue-600"
    @click="onClick"
  >
    <slot />
  </button>
</template>
