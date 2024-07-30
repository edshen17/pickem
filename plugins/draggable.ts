import { VueDraggableNext } from 'vue-draggable-next'

declare module 'vue' {
  interface GlobalComponents {
    VueDraggableNext: typeof VueDraggableNext
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('draggable', VueDraggableNext)
})
