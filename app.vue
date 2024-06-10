<script setup lang="ts">
import { appName } from '~/constants'
import 'quasar/src/css/index.sass'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

useHead({
  title: appName,
})

const $q = useQuasar()

const color = useColorMode()

watch(color, (newMode) => {
  $q.dark.set(newMode.value !== 'light')
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
