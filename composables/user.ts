import { acceptHMRUpdate, defineStore } from 'pinia'
import type { IUser } from '~/view-models/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)

  function setUser(v: IUser | null) {
    // @ts-expect-error user permissions is kysely generated type
    user.value = v
  }

  async function getUser() {
    const { data } = await useFetch<IUser>('/api/users')
    if (data.value)
      setUser(data.value)
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
