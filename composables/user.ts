import type { Users } from 'kysely-codegen'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<Users | null>(null)

  function setUser(v: Users | null) {
    user.value = v
  }

  async function getUser() {
    const response = await fetch(`${useRuntimeConfig().public.baseUrl}/api/users`)
    if (response.ok) {
      const { data } = await response.json()
      setUser(data)
    }
  }

  function resetUser() {
    setUser(null)
  }

  return {
    user,
    getUser,
    setUser,
    resetUser,
  }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
