<script setup lang="ts">
const emit = defineEmits<{
  (e: 'popupClose'): void
}>()

function popupClose() {
  emit('popupClose')
}
</script>

<template>
  <div
    class="u-relative u-mx-auto u-my-6 u-mb-4 u-w-11/12 u-border-0 u-rounded u-bg-red-200 u-px-6 u-py-2 u-text-lg u-text-red-800 md:u-w-1/2"
  >
    <div class="u-flex u-justify-between">
      <slot />
      <button @click="popupClose">
        <div class="i-carbon-close u-text-2xl" />
      </button>
    </div>
  </div>
</template>
