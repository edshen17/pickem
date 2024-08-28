import { computed } from 'vue'

export function useCurrentRoute() {
  const router = useRouter()
  const currentRoute = computed(() => router.currentRoute.value)
  return currentRoute
}
