<script setup lang="ts">
const router = useRouter()
const user = useSupabaseUser()
const { user: piniaUser } = storeToRefs(useUserStore())

const isLoggedIn = computed(() => {
  return Boolean(piniaUser.value)
})

const userProfileImg = user.value?.user_metadata.picture
  || (user.value?.user_metadata.name
    ? `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.value.user_metadata.name)}`
    : 'https://api.dicebear.com/8.x/shapes/svg?seed=random')

const showMobileMenu = ref(false)
const showDropdownMenu = ref(false)

watch(() => router.currentRoute.value, () => {
  showMobileMenu.value = false
  showDropdownMenu.value = false
})

const routerLinks = computed(() => {
  return [
    {
      title: 'Log In',
      path: '/log-in',
      isShowing: !isLoggedIn.value,
    },
    {
      title: 'Sign Up',
      path: '/sign-up',
      isShowing: !isLoggedIn.value,
    },
  ]
})

const innerRouterLinks = computed(() => {
  return [
    {
      title: 'Settings',
      path: '/settings',
      isShowing: isLoggedIn.value,
    },
    {
      title: 'Log out',
      path: '/log-out',
      isShowing: isLoggedIn.value,
    },
  ]
})

function handleEscape(e: KeyboardEvent) {
  if (['Esc', 'Escape'].includes(e.key))
    showDropdownMenu.value = false
}

onBeforeMount(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <header class="u-relative u-top-0 u-z-100 u-w-full u-flex u-flex-wrap u-items-center u-justify-between u-border-b-2 u-bg-white u-px-4 u-py-3 lg:u-sticky dark:u-border-gray-700 dark:u-border-none md:u-border-none dark:u-bg-dark md:u-shadow-md dark:md:u-border-b-1.5">
    <div class="u-w-full u-flex u-items-center u-justify-between u-py-1 lg:u-w-auto lg:u-py-2">
      <RouterLink to="/" class="u-px-3 u-text-4xl u-text-black u-font-bold u-font-sans dark:u-text-white">
        PickEm
      </RouterLink>
      <div class="u-px-3 lg:u-px-0">
        <button type="button" class="u-block lg:u-hidden" @click="showMobileMenu = !showMobileMenu">
          <div v-if="!showMobileMenu" i-carbon-menu class="u-text-xl" />
          <div v-else i-carbon-close class="u-text-2xl" />
        </button>
      </div>
    </div>
    <div class="u-items-center u-px-1 u-pb-4 u-pt-2 lg:u-flex lg:u-py-0" :class="showMobileMenu ? 'u-block' : 'u-hidden'">
      <div v-for="routerLink in routerLinks" :key="routerLink.title">
        <RouterLink
          v-if="routerLink.isShowing" :to="routerLink.path"
          :class="`u-py-3 lg:u-mt-0 lg:u-ml-2 u-block sm:u-py-0 u-rounded u-px-3 lg:u-px-4 u-nav-link ${routerLink.path === router.currentRoute.value.path ? 'u-text-black dark:u-text-gray-300' : ''}`"
        >
          {{ routerLink.title }}
        </RouterLink>
      </div>
      <div v-if="isLoggedIn" class="u-relative u-hidden lg:u-block">
        <button class="u-relative u-z-10 u-mx-2 u-block u-h-10 u-w-10 u-overflow-hidden u-border-transparent u-rounded-full u-outline-none u-outline-none focus:u-ring-2 hover:u-ring-2 focus:u-ring-pink-600 hover:u-ring-pink-600" @click="showDropdownMenu = !showDropdownMenu">
          <img :src="userProfileImg" class="u-h-full u-w-full u-object-cover">
        </button>
        <button v-if="showDropdownMenu" class="u-fixed u-inset-0 u-h-full u-w-full u-cursor-default" tabindex="-1" @click="showDropdownMenu = false" />
        <div v-if="showDropdownMenu" class="u-absolute u-right-0 u-m-3 u-w-80 u-rounded-md u-bg-gray-800 u-shadow-xl">
          <div class="u-mx-auto u-w-full u-px-3 lg:u-text-white">
            <div class="u-my-6 lg:u-my-2" />
            <hr class="u-mx-auto u-border-gray-400 lg:u-hidden">
            <div class="u-grid u-grid-flow-col u-grid-cols-12">
              <img :src="userProfileImg" class="u-z-10 u-col-span-3 u-mx-4 u-my-4 u-block u-h-16 u-w-16 u-rounded-full u-object-cover lg:u-col-span-4 md:u-col-span-2"><div class="font-semi-bold u-col-span-9 u-mx-6 u-my-3 md:u-mx-0">
                <p class="u-text-lg">
                  {{ piniaUser?.name }}
                </p>
              </div>
            </div>
            <hr class="u-mx-auto u-border-gray-400">
            <div class="u-mt-6 lg:u-my-2">
              <div v-for="link in innerRouterLinks" :key="link.path" class="u-inline-block u-h-full u-w-full u-py-4 u-text-gray-500 u-no-underline lg:u-px-3 lg:u-py-3">
                <RouterLink v-if="link.isShowing" :to="link.path" class="u-inline-block u-h-full u-w-full u-py-4 u-text-white u-no-underline lg:u-rounded-md lg:u-px-4 lg:u-py-2 lg:hover:u-bg-gray-600">
                  {{ link.title }}
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLoggedIn" class="u-mx-auto u-mt-4 u-h-2/6 u-w-full u-px-3 u-text-gray-500 lg:u-hidden lg:u-text-white">
        <!-- refactor this component as it's the same as above -->
        <div class="u-my-6 lg:u-my-2" />
        <hr class="u-mx-auto u-border-gray-400 lg:u-hidden">
        <div class="grid-flow-col u-grid u-grid-cols-12">
          <img :src="userProfileImg" class="u-z-10 u-col-span-3 u-mx-4 u-my-4 u-block u-h-16 u-w-16 u-rounded-full u-object-cover lg:u-col-span-4 md:u-col-span-2">
          <div class="u-col-span-9 u-mx-6 u-my-3 md:u-mx-0">
            <p class="u-text-lg">
              {{ piniaUser?.name }}
            </p>
          </div>
        </div>
        <hr class="u-mx-auto u-border-gray-400">
        <div class="u-mt-6 lg:u-my-2">
          <div v-for="link in innerRouterLinks" :key="link.path" class="u-inline-block u-h-full u-w-full u-py-4 u-text-gray-500 u-no-underline lg:u-px-3 lg:u-py-3">
            <RouterLink :to="link.path">
              {{ link.title }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
