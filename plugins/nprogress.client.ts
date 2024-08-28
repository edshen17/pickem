export default defineNuxtPlugin(() => {
  const { start, finish } = useLoadingIndicator()
  const router = useRouter()
  router.beforeEach((to, from) => {
    if (to.path !== from.path)
      start()
  })
  router.afterEach(() => {
    finish()
  })
})
